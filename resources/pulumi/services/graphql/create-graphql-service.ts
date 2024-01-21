import * as k8s from '@pulumi/kubernetes';

import { graphqlServiceName } from './graphql';

export function createGraphqlService(apiPort: number) {
  return new k8s.core.v1.Service(`${graphqlServiceName}-cluster-ip`, {
    metadata: {
      name: `${graphqlServiceName}-cluster-ip`,
    },
    spec: {
      ports: [
        {
          name: 'api',
          port: apiPort,
          targetPort: apiPort,
        },
      ],
      selector: {
        component: graphqlServiceName,
      },
      type: 'ClusterIP',
    },
  });
}
