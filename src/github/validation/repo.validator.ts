/**
 * -------------------------
 * REPOSITORY VALIDATION
 * -------------------------
 * Checks GitHub repository accessibility using Octokit API.
 *
 * Responsibilities:
 * - verify repo exists
 * - verify access permissions
 * - handle retry on transient errors
 */

import { getOctokit } from '../client/github.client.js';
import { logger } from '../../utils/logger.js';
import { isVerbose } from '../../cli/ui/output-mode.js';

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
 * LOCAL RETRY (LEGACY SIMPLE VERSION)
 * -------------------------
 * Lightweight retry mechanism for validation request.
 */
async function retry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 300
): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    const status = err?.status;

    /**
     * WARNING TRACE (VERBOSE MODE ONLY)
     */
    if (isVerbose()) {
      logger.warn(
        `[GitHub] validate repo failed (status=${status ?? 'unknown'})`
      );
    }

    if (retries <= 0) throw err;

    await sleep(delay);

    return retry(fn, retries - 1, delay * 1.5);
  }
}

/**
 * -------------------------
 * VALIDATE REPOSITORY ACCESS
 * -------------------------
 * Ensures GitHub repo is reachable and accessible.
 */
export async function validateRepositoryAccess(
  owner: string,
  repo: string
): Promise<boolean> {
  try {
    /**
     * DEBUG TRACE
     */
    if (isVerbose()) {
      logger.debug(`[GitHub] validating repository ${owner}/${repo}`);
    }

    await retry(() =>
      getOctokit().rest.repos.get({
        owner,
        repo,
      })
    );

    /**
     * SUCCESS TRACE
     */
    if (isVerbose()) {
      logger.debug(`[GitHub] repository valid ${owner}/${repo}`);
    }

    return true;
  } catch (err: any) {
    /**
     * ERROR TRACE
     */
    logger.error(
      `[GitHub] Repository validation failed | status=${err?.status} | message=${err?.message}`
    );

    return false;
  }
}