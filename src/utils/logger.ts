/**
 * -------------------------
 * LOGGER
 * -------------------------
 */

import chalk from 'chalk';
import { isDebug } from './debug.js';

/**
 * -------------------------
 * RUNTIME MODES
 * -------------------------
 */
function isVerbose(): boolean {
  return process.env.VERBOSE === '1';
}

function isSilent(): boolean {
  return process.env.SILENT === '1';
}

/**
 * -------------------------
 * LOGGER CORE
 * -------------------------
 * Unified CLI logger handling:
 * - silent mode (CI)
 * - verbose mode (debug traces)
 * - debug mode (dev tracing)
 */
export const logger = {
  /**
   * -------------------------
   * INFO
   * -------------------------
   */
  info: (msg: string) => {
    if (isSilent()) return;
    console.log(chalk.blue(`[INFO] ${msg}`));
  },

  /**
   * -------------------------
   * SUCCESS
   * -------------------------
   */
  success: (msg: string) => {
    if (isSilent()) return;
    console.log(chalk.green(`[SUCCESS] ${msg}`));
  },

  /**
   * -------------------------
   * WARN
   * -------------------------
   */
  warn: (msg: string) => {
    if (isSilent()) return;
    console.log(chalk.yellow(`[WARN] ${msg}`));
  },

  /**
   * -------------------------
   * ERROR
   * -------------------------
   */
  error: (msg: string) => {
    console.log(chalk.red(`[ERROR] ${msg}`));
  },

  /**
   * -------------------------
   * DEBUG
   * -------------------------
   */
  debug: (msg: string) => {
    if (isSilent()) return;

    if (isVerbose() || isDebug()) {
      console.log(chalk.gray(`[DEBUG] ${msg}`));
    }
  },
};