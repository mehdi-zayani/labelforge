/**
 * -------------------------
 * CLI SPLASH SCREEN
 * -------------------------
 */

import chalk from 'chalk';
import figlet from 'figlet';
import pkg from '../../../package.json' with { type: 'json' };
import { isSilent } from '../ui/output-mode.js';

/**
 * -------------------------
 * PRINT SPLASH
 * -------------------------
 * Displays CLI banner with:
 * - ASCII title (figlet)
 * - version
 * - author
 *
 * Disabled in silent mode (CI / non-interactive usage)
 */
export function printSplash() {
  if (isSilent()) return;

  const title = figlet.textSync('Labelforge', {
    horizontalLayout: 'default',
  });

  console.log(chalk.cyan(title));

  console.log(chalk.gray('────────────────────────────'));

  console.log(chalk.white('version : ') + chalk.green(pkg.version));

  console.log(chalk.white('author  : ') + chalk.blue('Mehdi Zayani'));

  console.log(chalk.gray('────────────────────────────\n'));
}