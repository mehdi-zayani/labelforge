/**
 * -------------------------
 * GITHUB REQUEST WRAPPER
 * -------------------------
 * Core abstraction layer over Octokit.
 *
 * Responsibilities:
 * - Retry logic with backoff
 * - Timeout control
 * - Rate limit handling
 * - Centralized error handling
 * - Debug logging support
 */

import { getOctokit } from '../client/github.client.js';
import { logger } from '../../utils/logger.js';
import { handleGitHubError } from '../handlers/github-error.handler.js';
import { handleRateLimit } from '../handlers/rate-limit.handler.js';
import { withTimeout } from '../resilience/timeout.js';
import { isDebug } from '../../utils/debug.js';

/**
 * -------------------------
 * REQUEST OPTIONS
 * -------------------------
 */
type RequestOptions = {
  timeoutMs?: number;
  retries?: number;
};

/**
 * -------------------------
 * GITHUB LABEL TYPE
 * -------------------------
 */
export type GitHubLabel = {
  name: string;
  color: string;
  description: string | null;
};

/**
 * -------------------------
 * SLEEP UTILITY
 * -------------------------
 */
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * -------------------------
 * RETRY EXECUTOR CORE
 * -------------------------
 * Handles:
 * - retries
 * - exponential backoff
 * - timeout wrapper
 * - rate limit inspection
 * - debug tracing
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
      /**
       * DEBUG TRACE
       */
      if (isDebug()) {
        logger.debug(`[GitHub] ${context} attempt ${attempt + 1}`);
      }

      /**
       * TIMEOUT WRAP
       */
      const response: any = await withTimeout(fn(), timeoutMs);

      /**
       * RATE LIMIT HANDLING
       */
      if (response?.headers) {
        handleRateLimit(response.headers);
      }

      return response;
    } catch (error: unknown) {
      lastError = error;

      const status = (error as any)?.status;

      const isRetryable =
        status === 429 || (status >= 500 && status < 600);

      /**
       * CENTRALIZED ERROR HANDLING
       */
      handleGitHubError(error, context);

      /**
       * STOP CONDITIONS
       */
      if (!isRetryable || attempt === retries) {
        throw error;
      }

      /**
       * BACKOFF DELAY
       */
      const delay = Math.min(1000, 500 * Math.pow(2, attempt));

      if (isDebug()) {
        logger.warn(
          `[GitHub] retrying ${context} in ${delay}ms (attempt ${attempt + 1})`
        );
      }

      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * -------------------------
 * GITHUB REQUEST API
 * -------------------------
 */
export const githubRequest = {
  /**
   * FETCH LABELS
   */
  async fetchLabels(owner: string, repo: string): Promise<GitHubLabel[]> {
    const octokit = getOctokit();

    const res = await executeWithRetry<any>(
      () => octokit.rest.issues.listLabelsForRepo({ owner, repo }),
      'fetchLabels'
    );

    return res.data.map((l: any) => ({
      name: l.name,
      color: l.color,
      description: l.description ?? null,
    }));
  },

  /**
   * CREATE LABEL
   */
  async createLabel(owner: string, repo: string, payload: GitHubLabel) {
    const octokit = getOctokit();

    return executeWithRetry(
      () =>
        octokit.rest.issues.createLabel({
          owner,
          repo,
          name: payload.name,
          color: payload.color,
          description: payload.description ?? '',
        }),
      'createLabel'
    );
  },

  /**
   * UPDATE LABEL
   */
  async updateLabel(
    owner: string,
    repo: string,
    currentName: string,
    payload: GitHubLabel
  ) {
    const octokit = getOctokit();

    return executeWithRetry(
      () =>
        octokit.rest.issues.updateLabel({
          owner,
          repo,
          name: currentName,
          new_name: payload.name,
          color: payload.color,
          description: payload.description ?? '',
        }),
      'updateLabel'
    );
  },

  /**
   * DELETE LABEL
   */
  async deleteLabel(owner: string, repo: string, name: string) {
    const octokit = getOctokit();

    return executeWithRetry(
      () => octokit.rest.issues.deleteLabel({ owner, repo, name }),
      'deleteLabel'
    );
  },
};