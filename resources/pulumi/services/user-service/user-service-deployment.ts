import * as k8s from '@pulumi/kubernetes';
import type { Output } from '@pulumi/pulumi';

import { userServiceName } from './user-service';

export function userServiceDeployment(imageName: Output<string>, port: number) {
  new k8s.apps.v1.Deployment(userServiceName, {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
      name: userServiceName,
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
              image: imageName,
              name: userServiceName,
              ports: [{ containerPort: port }],
            },
          ],
        },
      },
    },
  });
}
