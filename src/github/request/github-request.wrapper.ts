import { octokit } from "../client.js";
import { logger } from "../../utils/logger.js";
import { handleGitHubError } from "../github-error.handler.js";
import { handleRateLimit } from "../rate-limit.handler.js";
import { withTimeout } from "./timeout.js";

type RequestOptions = {
  timeoutMs?: number;
  retries?: number;
};

export type GitHubLabel = {
  name: string;
  color: string;
  description?: string | null;
};

type GitHubLabelListResponse = {
  data: GitHubLabel[];
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * FIX IMPORTANT:
 * fn must preserve type T instead of any
 */
async function executeWithRetry<T>(
  fn: () => Promise<T>,
  context: string,
  options?: RequestOptions
): Promise<T> {
  const retries = options?.retries ?? 2;
  const timeoutMs = options?.timeoutMs ?? 10000;

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      logger.debug(`[GitHub] ${context} attempt ${attempt + 1}`);

      const response = await withTimeout(fn(), timeoutMs);

      if (response && typeof response === "object" && "headers" in response) {
        handleRateLimit((response as any).headers);
      }

      return response;
    } catch (error: unknown) {
      lastError = error;

      const status = (error as any)?.status;

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
  async fetchLabels(
    owner: string,
    repo: string,
    options?: RequestOptions
  ): Promise<GitHubLabel[]> {
    const res = await executeWithRetry<GitHubLabelListResponse>(
      () => octokit.issues.listLabelsForRepo({ owner, repo }),
      "fetchLabels",
      options
    );

    return res.data;
  },

  async createLabel(
    owner: string,
    repo: string,
    payload: GitHubLabel,
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

  async updateLabel(
    owner: string,
    repo: string,
    currentName: string,
    payload: GitHubLabel,
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

  async deleteLabel(
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