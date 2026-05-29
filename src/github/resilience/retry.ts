import { getBackoffDelay } from "./backoff.js";
import { logger } from "../../utils/logger.js";
import { isDebug } from "../../utils/debug.js";

type RetryOptions = {
  retries?: number;
  baseDelay?: number;
};

export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { retries = 3, baseDelay = 500 } = options;

  let lastError: any;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (isDebug()) {
        logger.debug(`[Retry] attempt ${attempt + 1}`);
      }

      return await fn();
    } catch (error: any) {
      lastError = error;

      const status = error?.status;

      const isRetryable =
        status === 429 || (status >= 500 && status < 600);

      if (!isRetryable || attempt === retries) {
        throw error;
      }

      const delay = getBackoffDelay(attempt, baseDelay);

      if (isDebug()) {
        logger.warn(
          `[Retry] retrying in ${delay}ms (status=${status ?? "unknown"})`
        );
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}