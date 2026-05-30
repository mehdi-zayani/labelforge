/**
 * -------------------------
 * CLI ERROR HANDLER
 * -------------------------
 */

import { logger } from '../../utils/logger.js';

/**
 * -------------------------
 * ERROR HANDLING STRATEGY
 * -------------------------
 * Centralized handler for all CLI runtime errors.
 *
 * Ensures:
 * - consistent logging format
 * - safe error serialization
 * - controlled process exit
 */
export function handleCliError(error: any) {
  /**
   * -------------------------
   * GENERIC FAILURE LOG
   * -------------------------
   */
  logger.error('CLI execution failed');

  /**
   * -------------------------
   * ERROR NORMALIZATION
   * -------------------------
   */
  if (error instanceof Error) {
    logger.error(error.message);
  } else {
    logger.error(String(error));
  }

  /**
   * -------------------------
   * PROCESS TERMINATION
   * -------------------------
   */
  process.exit(1);
}