import { logger } from "../../utils/logger.js";
import { isVerbose } from "../../cli/ui/output-mode.js";

export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  if (isVerbose()) {
    logger.debug(`[Timeout] timeout=${timeoutMs}ms`);
  }

  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      if (isVerbose()) {
        logger.debug(`[Timeout] request exceeded ${timeoutMs}ms`);
      }

      reject(new Error(`GitHub request timeout (${timeoutMs}ms)`));
    }, timeoutMs);

    promise
      .then((res) => {
        clearTimeout(timer);

        if (isVerbose()) {
          logger.debug("[Timeout] request completed");
        }

        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);

        if (isVerbose()) {
          logger.debug("[Timeout] request failed before timeout");
        }

        reject(err);
      });
  });
}