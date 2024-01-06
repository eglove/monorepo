import { readFileSync } from 'node:fs';

import * as docker from '@pulumi/docker';

import { userServiceName } from './user-service';

export function userServiceImage() {
  const projectRoot = '../../apps/user-service';

  const packageJson = readFileSync(`${projectRoot}/package.json`, 'utf8');
  const parsed = JSON.parse(packageJson) as { version: string };
  const { version } = parsed;

  return new docker.Image(`${userServiceName}-image`, {
    build: {
      context: projectRoot,
      dockerfile: `${projectRoot}/Dockerfile`,
      platform: 'linux/amd64',
    },
    imageName: `ghcr.io/eglove/${userServiceName}:${version}`,
  });
}
