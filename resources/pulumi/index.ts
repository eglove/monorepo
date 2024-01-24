import * as k8s from '@pulumi/kubernetes';

import { graphql } from './services/graphql/graphql';
import { imageOptimization } from './services/image-optimization/image-optimization';

imageOptimization();

const { graphqlService, graphqlPort } = graphql();

new k8s.yaml.ConfigFile('nginx-ingress-controller', {
  file: 'https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml',
});

new k8s.networking.v1.Ingress('nginx-ingress', {
  metadata: {
    annotations: {
      'kubernetes.io/ingress.class': 'nginx',
      'nginx.ingress.kubernetes.io/proxy-body-size': '100m',
      'nginx.ingress.kubernetes.io/rewrite-target': '/$2',
      'nginx.ingress.kubernetes.io/use-regex': 'true',
    },
  },
  spec: {
    rules: [
      {
        http: {
          paths: [
            {
              backend: {
                service: {
                  name: graphqlService.metadata.name,
                  port: { number: graphqlPort },
                },
              },
              path: '/graphql(/|$)(.*)',
              pathType: 'ImplementationSpecific',
            },
          ],
        },
      },
    ],
  },
});
