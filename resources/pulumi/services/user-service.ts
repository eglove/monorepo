import { readFileSync } from 'node:fs';

import * as docker from '@pulumi/docker';
import * as k8s from '@pulumi/kubernetes';
import type { core } from '@pulumi/kubernetes/types/input';

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

  const container: core.v1.Container = {
    image: userServiceImage.imageName,
    name: userServiceName,
    ports: [{ containerPort: port }],
  };

  const labels = { component: userServiceName };

  return {
    container,
    labels,
  };
}
