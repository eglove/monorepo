import * as k8s from '@pulumi/kubernetes';

import { userService } from './services/user-service';

const { container, labels } = userService();

new k8s.apps.v1.Deployment('ethang', {
  apiVersion: 'apps/v1',
  kind: 'Deployment',
  metadata: {
    name: 'ethang',
  },
  spec: {
    replicas: 1,
    selector: {
      matchLabels: {
        ...labels,
      },
    },
    template: {
      metadata: {
        labels: {
          ...labels,
        },
      },
      spec: {
        containers: [container],
      },
    },
  },
});
