import fs from 'node:fs';
import lodash from 'lodash';
import chalk from 'chalk';
import inquirer from 'inquirer';

import { runCommand } from './run-command.ts';

export async function semver(publishDirectory?: string) {
  console.info(
    chalk.bgRed.white(
      `Publishing dir: ${lodash.isNil(publishDirectory) ? '.' : publishDirectory}`,
    ),
  );
  const { semver } = await inquirer.prompt<{ semver: string }>([
    {
      choices: ['patch', 'minor', 'major', 'no-publish'],
      message: 'SemVer',
      name: 'semver',
      type: 'list',
    },
  ]);

  if (semver === 'no-publish') {
    return;
  }

  runCommand(`npm version ${semver}`);

  if (lodash.isNil(publishDirectory)) {
    runCommand('npm publish --access public');
  } else {
    fs.copyFileSync('package.json', `${publishDirectory}/package.json`);
    runCommand(
      `cd ${publishDirectory} && npm publish --access public && cd ..`,
    );
  }
}
