import * as k8s from '@pulumi/kubernetes';

import { userServiceName } from './user-service';

export function userServiceService(port: number) {
  new k8s.core.v1.Service(`${userServiceName}-cluster-ip`, {
    metadata: {
      name: `${userServiceName}-cluster-ip`,
    },
    spec: {
      ports: [
        {
          port,
          targetPort: port,
        },
      ],
      selector: {
        component: userServiceName,
      },
      type: 'ClusterIP',
    },
  });
}
