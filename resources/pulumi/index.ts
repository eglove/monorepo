import * as k8s from '@pulumi/kubernetes';

import { imageOptimization } from './services/image-optimization/image-optimization';

// const { clusterService: userClusterService, port: userServicePort } =
//   userService();
const { clusterService: imageService, apiPort: imagePort } =
  imageOptimization();

new k8s.yaml.ConfigFile('nginx-ingress-controller', {
  file: 'https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml',
});

new k8s.networking.v1.Ingress('nginx-ingress', {
  metadata: {
    annotations: {
      'kubernetes.io/ingress.class': 'nginx',
      'nginx.ingress.kubernetes.io/proxy-body-size': '50m',
      'nginx.ingress.kubernetes.io/rewrite-target': '/$2',
      'nginx.ingress.kubernetes.io/use-regex': 'true',
    },
  },
  spec: {
    rules: [
      {
        http: {
          paths: [
            // {
            //   backend: {
            //     service: {
            //       name: userClusterService.metadata.name,
            //       port: {
            //         number: userServicePort,
            //       },
            //     },
            //   },
            //   path: '/user(/|$)(.*)',
            //   pathType: 'ImplementationSpecific',
            // },
            {
              backend: {
                service: {
                  name: imageService.metadata.name,
                  port: {
                    number: imagePort,
                  },
                },
              },
              path: '/image(/|$)(.*)',
              pathType: 'ImplementationSpecific',
            },
          ],
        },
      },
    ],
  },
});
