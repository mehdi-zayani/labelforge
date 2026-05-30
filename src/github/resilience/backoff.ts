import { logger } from '../../utils/logger.js';
import { isVerbose } from '../../cli/ui/output-mode.js';

export function getBackoffDelay(
  attempt: number,
  baseDelay = 500,
  maxDelay = 10_000
): number {
  const exponential = baseDelay * 2 ** attempt;

  const delay = Math.min(exponential, maxDelay);

  if (isVerbose()) {
    logger.debug(`[Backoff] attempt=${attempt + 1} delay=${delay}ms`);
  }

  return delay;
}
