import * as k8s from '@pulumi/kubernetes';

import { userService, userServiceName } from './services/user-service';

const userServicePod = userService();

export const userServiceService = new k8s.core.v1.Service(
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
          targetPort: userServicePod.spec.containers[0].ports[0].containerPort,
        },
      ],
      selector: {
        component: userServiceName,
      },
      type: 'NodePort',
    },
  },
);
