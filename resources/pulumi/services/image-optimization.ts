import * as docker from '@pulumi/docker';
import * as k8s from '@pulumi/kubernetes';

export const imageOptimizationServiceName = 'image-optimization';

export function imageOptimization() {
  const port = 8080;
  const projectRoot = '../../apps/image-optimization';

  const image = new docker.Image(`${imageOptimizationServiceName}-image`, {
    build: {
      context: projectRoot,
      dockerfile: `${projectRoot}/Dockerfile`,
      platform: 'linux/amd64',
    },
    imageName: `ghcr.io/eglove/${imageOptimizationServiceName}:latest`,
  });

  // eslint-disable-next-line no-new
  new k8s.core.v1.Service(`${imageOptimizationServiceName}-port`, {
    metadata: {
      name: `${imageOptimizationServiceName}-port`,
    },
    spec: {
      ports: [
        {
          nodePort: 31_516,
          port: 3050,
          targetPort: port,
        },
      ],
      selector: {
        component: imageOptimizationServiceName,
      },
      type: 'NodePort',
    },
  });

  // eslint-disable-next-line no-new
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
              image: image.imageName,
              name: imageOptimizationServiceName,
              ports: [{ containerPort: port }],
            },
          ],
        },
      },
    },
  });
}
