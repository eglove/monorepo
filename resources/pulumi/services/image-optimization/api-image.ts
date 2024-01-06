import * as docker from '@pulumi/docker';

import { imageOptimizationServiceName } from './image-optimization';

export function apiImage() {
  const projectRoot = '../../apps/image-optimization';

  return new docker.Image(`${imageOptimizationServiceName}-image`, {
    build: {
      context: projectRoot,
      dockerfile: `${projectRoot}/Dockerfile`,
      platform: 'linux/amd64',
    },
    imageName: `ghcr.io/eglove/${imageOptimizationServiceName}:latest`,
  });
}
