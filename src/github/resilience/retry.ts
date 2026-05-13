import { getBackoffDelay } from "./backoff.js";

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

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}