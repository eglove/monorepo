import * as docker from '@pulumi/docker';
import * as k8s from '@pulumi/kubernetes';

export const userServiceName = 'user-service';

export function userService() {
  const userServiceImage = new docker.Image(`${userServiceName}-image`, {
    build: {
      context: '../../apps/user-service',
      dockerfile: '../../apps/user-service/Dockerfile',
      platform: 'linux/amd64',
    },
    imageName: 'docker.io/eglove/user-service:1.0.0',
  });

  return new k8s.core.v1.Pod(`${userServiceName}-pod`, {
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
}
