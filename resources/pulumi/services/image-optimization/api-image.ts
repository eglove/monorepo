import { readFileSync } from 'node:fs';

import { parse } from '@iarna/toml';
import * as docker from '@pulumi/docker';

import { imageOptimizationServiceName } from './image-optimization';

export function apiImage() {
  const projectRoot = '../../apps/image-optimization';

  const cargoToml = readFileSync(`${projectRoot}/Cargo.toml`, 'utf8');
  const tomlData = parse(cargoToml) as { package: { version: string } };

  return new docker.Image(`${imageOptimizationServiceName}-image`, {
    build: {
      context: projectRoot,
      dockerfile: `${projectRoot}/Dockerfile`,
      platform: 'linux/amd64',
    },
    imageName: `ghcr.io/eglove/${imageOptimizationServiceName}:${tomlData.package.version}`,
  });
}
