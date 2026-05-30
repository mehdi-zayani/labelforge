/**
 * -------------------------
 * RETRY UTILITY
 * -------------------------
 * Generic retry wrapper with exponential backoff support.
 *
 * Used across:
 * - GitHub API calls
 * - resilient network operations
 */

import { getBackoffDelay } from './backoff.js';
import { logger } from '../../utils/logger.js';
import { isVerbose } from '../../cli/ui/output-mode.js';

/**
 * -------------------------
 * RETRY OPTIONS
 * -------------------------
 */
type RetryOptions = {
  retries?: number;
  baseDelay?: number;
};

/**
 * -------------------------
 * RETRY EXECUTOR
 * -------------------------
 * Executes a function with retry logic for retryable errors.
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { retries = 3, baseDelay = 500 } = options;

  let lastError: any;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      /**
       * VERBOSE TRACE
       */
      if (isVerbose()) {
        logger.debug(`[Retry] attempt ${attempt + 1}`);
      }

      return await fn();
    } catch (error: any) {
      lastError = error;

      const status = error?.status;

      const isRetryable =
        status === 429 || (status >= 500 && status < 600);

      /**
       * STOP CONDITION
       */
      if (!isRetryable || attempt === retries) {
        throw error;
      }

      const delay = getBackoffDelay(attempt, baseDelay);

      /**
       * RETRY TRACE
       */
      if (isVerbose()) {
        logger.debug(
          `[Retry] retrying in ${delay}ms (status=${status ?? 'unknown'})`
        );
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}