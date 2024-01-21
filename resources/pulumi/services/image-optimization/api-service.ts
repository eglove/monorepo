import * as k8s from '@pulumi/kubernetes';

import { imageOptimizationServiceName } from './image-optimization';

export function apiService(apiPort: number, mongoPort: number) {
  return new k8s.core.v1.Service(`${imageOptimizationServiceName}-cluster-ip`, {
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
          name: 'mongo',
          port: mongoPort,
          targetPort: mongoPort,
        },
      ],
      selector: {
        component: imageOptimizationServiceName,
      },
      type: 'ClusterIP',
    },
  });
}
