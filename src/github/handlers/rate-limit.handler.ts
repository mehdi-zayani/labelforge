/**
 * -------------------------
 * GITHUB RATE LIMIT HANDLER
 * -------------------------
 * Monitors GitHub API rate limits and logs warnings.
 *
 * Goal:
 * - avoid CLI spam
 * - keep critical signals visible
 * - expose debug info only when needed
 */

import { logger } from '../../utils/logger.js';
import { isDebug } from '../../utils/debug.js';

/**
 * -------------------------
 * THRESHOLDS
 * -------------------------
 */
const WARN_THRESHOLD = 200;
const CRITICAL_THRESHOLD = 50;

/**
 * -------------------------
 * RATE LIMIT HANDLER
 * -------------------------
 */
export function handleRateLimit(headers: Record<string, any>) {
  const limit = Number(headers['x-ratelimit-limit']);
  const remaining = Number(headers['x-ratelimit-remaining']);
  const reset = Number(headers['x-ratelimit-reset']);

  /**
   * INVALID HEADERS GUARD
   */
  if (!limit || remaining == null) return;

  const ratio = `${remaining}/${limit}`;

  /**
   * DEBUG TRACE ONLY
   * (no user-facing noise)
   */
  if (isDebug()) {
    logger.debug(`[GitHub] rate limit ${ratio}`);
  }

  /**
   * LOW WARNING (DEBUG ONLY UX)
   */
  if (
    isDebug() &&
    remaining <= WARN_THRESHOLD &&
    remaining > CRITICAL_THRESHOLD
  ) {
    logger.warn(`[GitHub] rate limit low ${ratio}`);
  }

  /**
   * CRITICAL WARNING (ALWAYS SHOWN)
   */
  if (remaining <= CRITICAL_THRESHOLD && remaining > 0) {
    logger.warn(`[GitHub] rate limit critical ${ratio}`);
  }

  /**
   * EXHAUSTED STATE (ALWAYS SHOWN)
   */
  if (remaining === 0) {
    const resetDate = new Date(reset * 1000);

    logger.error('GitHub API rate limit exceeded');
    logger.warn(`Resets at ${resetDate.toLocaleTimeString()}`);
  }
}