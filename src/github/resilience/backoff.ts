import { logger } from "../../utils/logger.js";
import { isDebug } from "../../utils/debug.js";

export function getBackoffDelay(
  attempt: number,
  baseDelay = 500,
  maxDelay = 10_000
): number {
  const exponential = baseDelay * 2 ** attempt;

  const delay = Math.min(exponential, maxDelay);

  if (isDebug()) {
    logger.debug(
      `[Backoff] attempt=${attempt + 1} delay=${delay}ms`
    );
  }

  return delay;
}