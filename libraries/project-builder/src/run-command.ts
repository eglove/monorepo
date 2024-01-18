import { execSync } from 'node:child_process';

import chalk from 'chalk';

export const runCommand = (command: string) => {
  console.info(chalk.greenBright(command));
  execSync(command, {
    stdio: 'inherit',
  });
};
