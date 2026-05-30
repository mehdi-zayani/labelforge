/**
 * -------------------------
 * TIMEOUT WRAPPER
 * -------------------------
 * Adds a hard timeout to async GitHub requests.
 *
 * Prevents:
 * - hanging requests
 * - infinite network waits
 */

import { logger } from '../../utils/logger.js';
import { isVerbose } from '../../cli/ui/output-mode.js';

/**
 * -------------------------
 * WITH TIMEOUT
 * -------------------------
 * Wraps a promise with a timeout constraint.
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  /**
   * TIMEOUT INIT TRACE
   */
  if (isVerbose()) {
    logger.debug(`[Timeout] timeout=${timeoutMs}ms`);
  }

  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      /**
       * TIMEOUT EXCEEDED TRACE
       */
      if (isVerbose()) {
        logger.debug(`[Timeout] request exceeded ${timeoutMs}ms`);
      }

      reject(new Error(`GitHub request timeout (${timeoutMs}ms)`));
    }, timeoutMs);

    promise
      .then((res) => {
        clearTimeout(timer);

        /**
         * SUCCESS TRACE
         */
        if (isVerbose()) {
          logger.debug('[Timeout] request completed');
        }

        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);

        /**
         * FAILURE TRACE
         */
        if (isVerbose()) {
          logger.debug('[Timeout] request failed before timeout');
        }

        reject(err);
      });
  });
}