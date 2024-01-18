import * as fs from 'node:fs';
import { isNil } from 'lodash';

import { gitUpdate } from './git-update.ts';

export async function updatePeerDependencies(
  ignorePeerDependencies?: string[],
) {
  const packageJson = fs.readFileSync('package.json', { encoding: 'utf8' });

  const packageObject = JSON.parse(packageJson) as {
    dependencies: Record<string, unknown>;
    peerDependencies: Record<string, unknown>;
  };

  packageObject.peerDependencies = {
    ...packageObject.dependencies,
  };

  if (!isNil(ignorePeerDependencies)) {
    for (const ignorePeerDependency of ignorePeerDependencies) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete packageObject.peerDependencies[ignorePeerDependency];
    }
  }

  fs.writeFileSync(
    'package.json',
    JSON.stringify(packageObject, null, 2) + '\n',
    'utf8',
  );

  await gitUpdate('Peer Dependency Update');
}
