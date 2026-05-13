import { octokit } from "../client.js";
import { logger } from "../../utils/logger.js";
import { handleGitHubError } from "../github-error.handler.js";
import { handleRateLimit } from "../rate-limit.handler.js";
import { withTimeout } from "./timeout.js";

type RequestOptions = {
  timeoutMs?: number;
  retries?: number;
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function executeWithRetry<T>(
  fn: () => Promise<any>,
  context: string,
  options?: RequestOptions
): Promise<T> {
  const retries = options?.retries ?? 2;
  const timeoutMs = options?.timeoutMs ?? 10000;

  let lastError: any;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      logger.debug(`[GitHub] ${context} attempt ${attempt + 1}`);

      const response = await withTimeout(fn(), timeoutMs);

      if (response?.headers) {
        handleRateLimit(response.headers);
      }

      return response;
    } catch (error: any) {
      lastError = error;

      const status = error?.status;

      const isRetryable =
        status === 429 || (status >= 500 && status < 600);

      handleGitHubError(error, context);

      if (!isRetryable || attempt === retries) {
        throw error;
      }

      const delay = 500 * Math.pow(2, attempt);

      logger.warn(
        `[GitHub] retrying ${context} in ${delay}ms (attempt ${attempt + 1})`
      );

      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * CENTRAL GITHUB WRAPPER (SDK LAYER)
 */
export const githubRequest = {
  fetchLabels(owner: string, repo: string, options?: RequestOptions) {
    return executeWithRetry(
      () => octokit.issues.listLabelsForRepo({ owner, repo }),
      "fetchLabels",
      options
    );
  },

  createLabel(
    owner: string,
    repo: string,
    payload: { name: string; color: string; description?: string },
    options?: RequestOptions
  ) {
    return executeWithRetry(
      () =>
        octokit.issues.createLabel({
          owner,
          repo,
          name: payload.name,
          color: payload.color,
          description: payload.description ?? "",
        }),
      "createLabel",
      options
    );
  },

  updateLabel(
    owner: string,
    repo: string,
    currentName: string,
    payload: { name: string; color: string; description?: string },
    options?: RequestOptions
  ) {
    return executeWithRetry(
      () =>
        octokit.issues.updateLabel({
          owner,
          repo,
          name: currentName,
          new_name: payload.name,
          color: payload.color,
          description: payload.description ?? "",
        }),
      "updateLabel",
      options
    );
  },

  deleteLabel(
    owner: string,
    repo: string,
    name: string,
    options?: RequestOptions
  ) {
    return executeWithRetry(
      () => octokit.issues.deleteLabel({ owner, repo, name }),
      "deleteLabel",
      options
    );
  },
};