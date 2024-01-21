import * as docker from '@pulumi/docker';

import { versions } from '../versions/versions';
import { graphqlServiceName } from './graphql';

export function createGraphqlImage() {
  const projectRoot = '../../apps/graphql';

  return new docker.Image(`${graphqlServiceName}-image`, {
    build: {
      context: projectRoot,
      dockerfile: `${projectRoot}/Dockerfile`,
      platform: 'linux/amd64',
    },
    imageName: `ghcr.io/eglove/${graphqlServiceName}:${versions.get('graphql')}`,
  });
}
