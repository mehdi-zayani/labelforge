import ora from 'ora';
import chalk from 'chalk';
import { isSilent } from './output-mode.js';

const isDebug = process.env.DEBUG === '1';

export async function runAction<T>(
  label: string,
  fn: () => Promise<T>
): Promise<T> {
  if (isSilent()) return fn();
  const spinner = ora(label).start();

  try {
    const result = await fn();
    spinner.succeed(chalk.green(label));
    if (process.env.DRY_RUN === '1') {
      console.log(chalk.magenta(`[DRY-RUN] ${label}`));
    }
    return result;
  } catch (err) {
    spinner.fail(chalk.red(label));
    throw err;
  }
}

export function debugLog(...args: any[]) {
  if (isDebug) {
    console.log('[DEBUG]', ...args);
  }
}
export function dryRunLog(msg: string) {
  console.log(chalk.magenta(`[DRY-RUN] ${msg}`));
}
