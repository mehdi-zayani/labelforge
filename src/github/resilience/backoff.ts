/**
 * -------------------------
 * BACKOFF STRATEGY
 * -------------------------
 * Computes exponential backoff delay for retry mechanisms.
 *
 * Used by:
 * - GitHub request retries
 * - resilience layer
 */

import { logger } from '../../utils/logger.js';
import { isVerbose } from '../../cli/ui/output-mode.js';

/**
 * -------------------------
 * BACKOFF CALCULATION
 * -------------------------
 * exponential backoff with max cap
 */
export function getBackoffDelay(
  attempt: number,
  baseDelay = 500,
  maxDelay = 10_000
): number {
  const exponential = baseDelay * 2 ** attempt;

  const delay = Math.min(exponential, maxDelay);

  /**
   * VERBOSE DEBUG ONLY
   */
  if (isVerbose()) {
    logger.debug(`[Backoff] attempt=${attempt + 1} delay=${delay}ms`);
  }

  return delay;
}