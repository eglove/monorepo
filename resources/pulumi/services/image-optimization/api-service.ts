import * as k8s from '@pulumi/kubernetes';

import { imageOptimizationServiceName } from './image-optimization';

export function apiService(
  apiPort: number,
  minioPort1: number,
  minioPort2: number,
) {
  new k8s.core.v1.Service(`${imageOptimizationServiceName}-cluster-ip`, {
    metadata: {
      name: `${imageOptimizationServiceName}-cluster-ip`,
    },
    spec: {
      ports: [
        {
          name: 'api',
          port: apiPort,
          targetPort: apiPort,
        },
        {
          name: 'minio1',
          port: minioPort1,
          targetPort: minioPort1,
        },
        {
          name: 'minio2',
          port: minioPort2,
          targetPort: minioPort2,
        },
      ],
      selector: {
        component: imageOptimizationServiceName,
      },
      type: 'ClusterIP',
    },
  });
}
