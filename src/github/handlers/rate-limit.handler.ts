import { logger } from '../../utils/logger.js';
import { isDebug } from '../../utils/debug.js';

const WARN_THRESHOLD = 200;
const CRITICAL_THRESHOLD = 50;

export function handleRateLimit(headers: Record<string, any>) {
  const limit = Number(headers['x-ratelimit-limit']);
  const remaining = Number(headers['x-ratelimit-remaining']);
  const reset = Number(headers['x-ratelimit-reset']);

  if (!limit || remaining == null) return;

  const ratio = `${remaining}/${limit}`;

  // DEBUG ONLY (NO UX POLLUTION)
  if (isDebug()) {
    logger.debug(`[GitHub] rate limit ${ratio}`);
  }

  // WARN LEVEL (DEBUG ONLY)
  if (
    isDebug() &&
    remaining <= WARN_THRESHOLD &&
    remaining > CRITICAL_THRESHOLD
  ) {
    logger.warn(`[GitHub] rate limit low ${ratio}`);
  }

  // CRITICAL LEVEL (ALWAYS KEEP, IMPORTANT)
  if (remaining <= CRITICAL_THRESHOLD && remaining > 0) {
    logger.warn(`[GitHub] rate limit critical ${ratio}`);
  }

  // EXHAUSTED (ALWAYS KEEP)
  if (remaining === 0) {
    const resetDate = new Date(reset * 1000);

    logger.error('GitHub API rate limit exceeded');
    logger.warn(`Resets at ${resetDate.toLocaleTimeString()}`);
  }
}
