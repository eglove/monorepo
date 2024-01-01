import { readFileSync } from 'node:fs';

import * as docker from '@pulumi/docker';
import * as k8s from '@pulumi/kubernetes';

export const userServiceName = 'user-service';

export function userService() {
  const port = 3000;
  const projectRoot = '../../apps/user-service';

  const packageJson = readFileSync(`${projectRoot}/package.json`, 'utf8');
  const parsed = JSON.parse(packageJson) as { version: string };
  const { version } = parsed;

  const userServiceImage = new docker.Image(`${userServiceName}-image`, {
    build: {
      context: projectRoot,
      dockerfile: `${projectRoot}/Dockerfile`,
      platform: 'linux/amd64',
    },
    imageName: `docker.io/eglove/user-service:${version}`,
  });

  // eslint-disable-next-line no-new
  new k8s.core.v1.Service(`${userServiceName}-port`, {
    metadata: {
      name: `${userServiceName}-port`,
    },
    spec: {
      ports: [
        {
          nodePort: 31_515,
          port: 3050,
          targetPort: port,
        },
      ],
      selector: {
        component: userServiceName,
      },
      type: 'NodePort',
    },
  });

  // eslint-disable-next-line no-new
  new k8s.apps.v1.Deployment('ethang', {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
      name: 'ethang',
    },
    spec: {
      replicas: 1,
      selector: {
        matchLabels: { component: userServiceName },
      },
      template: {
        metadata: {
          labels: { component: userServiceName },
        },
        spec: {
          containers: [
            {
              image: userServiceImage.imageName,
              name: userServiceName,
              ports: [{ containerPort: port }],
            },
          ],
        },
      },
    },
  });
}
