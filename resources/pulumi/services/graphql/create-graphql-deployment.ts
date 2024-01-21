import * as k8s from '@pulumi/kubernetes';
import type { Output } from '@pulumi/pulumi';

import { graphqlServiceName } from './graphql';

export function createGraphqlDeployment(
  imageName: Output<string>,
  apiPort: number,
) {
  return new k8s.apps.v1.Deployment(graphqlServiceName, {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
      name: graphqlServiceName,
    },
    spec: {
      replicas: 1,
      selector: {
        matchLabels: { component: graphqlServiceName },
      },
      template: {
        metadata: {
          labels: { component: graphqlServiceName },
        },
        spec: {
          containers: [
            {
              image: imageName,
              name: graphqlServiceName,
              ports: [{ containerPort: apiPort }],
            },
          ],
        },
      },
    },
  });
}
