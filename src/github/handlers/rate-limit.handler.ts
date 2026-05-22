import { logger } from "../../utils/logger.js";

const WARN_THRESHOLD = 200;
const CRITICAL_THRESHOLD = 50;

export function handleRateLimit(headers: Record<string, any>) {
  const limit = Number(headers["x-ratelimit-limit"]);
  const remaining = Number(headers["x-ratelimit-remaining"]);
  const reset = Number(headers["x-ratelimit-reset"]);

  if (!limit || remaining == null) return;

  const ratio = `${remaining}/${limit}`;

  // INFO 
  logger.info(`GitHub rate limit: ${ratio} remaining`);

  // WARN LEVEL
  if (remaining <= WARN_THRESHOLD && remaining > CRITICAL_THRESHOLD) {
    logger.warn(
      `GitHub rate limit is getting low: ${ratio} remaining`
    );
  }

  // CRITICAL LEVEL
  if (remaining <= CRITICAL_THRESHOLD && remaining > 0) {
    logger.warn(
      `GitHub rate limit is critical: ${ratio} remaining`
    );
  }

  // EXHAUSTED
  if (remaining === 0) {
    const resetDate = new Date(reset * 1000);

    logger.error("GitHub API rate limit exceeded");
    logger.warn(`Rate limit resets at: ${resetDate.toLocaleTimeString()}`);
  }
}