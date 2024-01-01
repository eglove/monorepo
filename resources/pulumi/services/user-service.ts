import { readFileSync } from 'node:fs';

import * as docker from '@pulumi/docker';
import * as k8s from '@pulumi/kubernetes';

export const userServiceName = 'user-service';

export function userService() {
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

  const userServicePod = new k8s.core.v1.Pod(`${userServiceName}-pod`, {
    metadata: {
      labels: {
        component: userServiceName,
      },
      name: `${userServiceName}-pod`,
    },
    spec: {
      containers: [
        {
          image: userServiceImage.imageName,
          name: userServiceName,
          ports: [
            {
              containerPort: 3000,
            },
          ],
        },
      ],
    },
  });

  const userServiceService = new k8s.core.v1.Service(
    `${userServiceName}-port`,
    {
      metadata: {
        name: `${userServiceName}-port`,
      },
      spec: {
        ports: [
          {
            nodePort: 31_515,
            port: 3050,
            targetPort:
              userServicePod.spec.containers[0].ports[0].containerPort,
          },
        ],
        selector: {
          component: userServiceName,
        },
        type: 'NodePort',
      },
    },
  );

  return { userServiceImage, userServicePod, userServiceService };
}
