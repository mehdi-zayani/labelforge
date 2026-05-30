/**
 * -------------------------
 * CLI STEP INDICATOR
 * -------------------------
 */

import chalk from 'chalk';
import { isSilent } from './output-mode.js';

/**
 * -------------------------
 * STEP LOGGER
 * -------------------------
 * Displays CLI pipeline step progression:
 * [1/3] validate repository
 * [2/3] resolve template
 * [3/3] run sync pipeline
 *
 * Disabled in silent mode.
 */
export function step(label: string, index: number, total: number) {
  if (isSilent()) return;

  console.log(
    chalk.gray(`[${index}/${total}]`) + ' ' + chalk.cyan(label)
  );
}