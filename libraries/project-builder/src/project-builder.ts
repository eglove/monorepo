import chalk from 'chalk';
import { simpleGit } from 'simple-git';
import type tsup from 'tsup';

import { buildProject } from './build-project.ts';
import { semver } from './semver.ts';
import { updatePeerDependencies } from './update-peer-dependencies.ts';
import { getHasChanges } from './util.ts';
import type { scripts } from './version-bump.ts';
import { versionBump } from './version-bump.ts';
import { isNil } from 'lodash';

type ProjectBuilderProperties = {
  ignorePeerDependencies?: string[];
  isLibrary?: boolean;
  postVersionBumpScripts: Array<keyof typeof scripts>;
  preVersionBumpScripts: Array<keyof typeof scripts>;
  publishDirectory?: string;
  tsConfigOverrides?: Record<string, unknown>;
  tsupOptions?: tsup.Options;
};

export async function projectBuilder(
  projectName: string,
  branch: string,
  {
    isLibrary,
    ignorePeerDependencies,
    postVersionBumpScripts,
    preVersionBumpScripts,
    publishDirectory,
    tsConfigOverrides,
    tsupOptions,
  }: ProjectBuilderProperties,
) {
  console.info(chalk.white.bgBlue(`Running for ${projectName}`));

  const git = simpleGit();
  const status = await git.status();

  if (!status.isClean()) {
    console.error('Commit your changes!');
    return;
  }

  await git.checkout(branch);
  await versionBump(preVersionBumpScripts, postVersionBumpScripts);

  if (isLibrary === true) {
    await updatePeerDependencies(ignorePeerDependencies);

    if (
      (await getHasChanges(branch)) &&
      !isNil(publishDirectory) &&
      !isNil(tsupOptions)
    ) {
      await buildProject(publishDirectory, tsupOptions, tsConfigOverrides);
    }

    if (await getHasChanges(branch)) {
      await semver(publishDirectory);
    }
  }

  await simpleGit().push();
  const remote = await simpleGit().listRemote(['--get-url']);
  console.info(chalk.blueBright(remote));
}
