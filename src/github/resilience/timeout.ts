import { logger } from "../../utils/logger.js";
import { isDebug } from "../../utils/debug.js";

export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  if (isDebug()) {
    logger.debug(`[Timeout] timeout=${timeoutMs}ms`);
  }

  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      if (isDebug()) {
        logger.warn(`[Timeout] request exceeded ${timeoutMs}ms`);
      }

      reject(new Error(`GitHub request timeout (${timeoutMs}ms)`));
    }, timeoutMs);

    promise
      .then((res) => {
        clearTimeout(timer);

        if (isDebug()) {
          logger.debug("[Timeout] request completed");
        }

        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);

        if (isDebug()) {
          logger.warn("[Timeout] request failed before timeout");
        }

        reject(err);
      });
  });
}