/**
 * -------------------------
 * GITHUB ERROR HANDLER
 * -------------------------
 * Centralized error interpretation for GitHub API responses.
 */

import { logger } from '../../utils/logger.js';

/**
 * -------------------------
 * HANDLE GITHUB ERRORS
 * -------------------------
 * Maps HTTP status codes to readable CLI messages.
 */
export function handleGitHubError(error: any, context: string) {
  const status = error?.status;

  /**
   * NOT FOUND (IGNORE CASE)
   * Example: label already deleted
   */
  if (status === 404) {
    logger.warn(`[SKIP] already deleted: ${context}`);
    return;
  }

  /**
   * GENERIC ERROR HEADER
   */
  logger.error(`GitHub API error in ${context}`);

  /**
   * AUTH ERROR
   */
  if (status === 401) {
    logger.error('Unauthorized (401) - check GitHub token');
  }

  /**
   * PERMISSION ERROR
   */
  else if (status === 403) {
    logger.error('Forbidden (403) - missing permissions');
  }

  /**
   * SERVER ERROR
   */
  else if (status >= 500) {
    logger.error('GitHub server error (5xx)');
  }

  /**
   * UNKNOWN ERROR
   */
  else {
    logger.error('Unexpected GitHub error');

    /**
     * DEBUG DUMP
     */
    logger.debug(JSON.stringify(error, null, 2));
  }
}