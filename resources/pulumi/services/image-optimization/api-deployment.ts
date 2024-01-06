import * as k8s from '@pulumi/kubernetes';
import type { Output } from '@pulumi/pulumi';

import { imageOptimizationServiceName } from './image-optimization';

export function apiDeployment(
  imageName: Output<string>,
  apiPort: number,
  minioContainer: k8s.types.input.core.v1.Container,
  minioVoumes: k8s.types.input.core.v1.Volume[],
) {
  new k8s.apps.v1.Deployment(imageOptimizationServiceName, {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
      name: imageOptimizationServiceName,
    },
    spec: {
      replicas: 1,
      selector: {
        matchLabels: { component: imageOptimizationServiceName },
      },
      template: {
        metadata: {
          labels: { component: imageOptimizationServiceName },
        },
        spec: {
          containers: [
            {
              image: imageName,
              name: imageOptimizationServiceName,
              ports: [{ containerPort: apiPort }],
            },
            minioContainer,
          ],
          volumes: [...minioVoumes],
        },
      },
    },
  });
}
