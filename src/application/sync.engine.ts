/**
 * -------------------------
 * LABEL SYNC ENGINE
 * -------------------------
 * Core business engine responsible for applying label changes
 * to GitHub based on prepared input data.
 *
 * IMPORTANT:
 * This module does NOT fetch data, does NOT load templates.
 * It ONLY executes sync operations.
 */

import { githubRequest } from '../github/request/github-request.wrapper.js';
import { logger } from '../utils/logger.js';

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
 * LOCAL LABEL TYPE
 * -------------------------
 */
type GitHubLabel = {
  name: string;
  color: string;
  description?: string;
};

/**
 * -------------------------
 * RETRY STRATEGY
 * -------------------------
 * Simple recursive retry with exponential backoff.
 */
async function retry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 300
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;

    await sleep(delay);

    return retry(fn, retries - 1, delay * 1.5);
  }
}

/**
 * -------------------------
 * SYNC ENGINE
 * -------------------------
 * Applies GitHub label changes:
 * 1. Deletes remote labels
 * 2. Creates template labels
 *
 * No external orchestration logic here.
 */
export async function syncEngine(
  owner: string,
  repo: string,
  remoteLabels: GitHubLabel[],
  templateLabels: GitHubLabel[],
  dryRun: boolean = true
) {
  /**
   * -------------------------
   * DELETE PHASE
   * -------------------------
   */
  logger.info('Cleaning existing labels...');

  for (const label of remoteLabels) {
    if (dryRun) {
      logger.debug(`[DRY-RUN][DELETE] ${label.name}`);
      continue;
    }

    try {
      await retry(() =>
        githubRequest.deleteLabel(owner, repo, label.name)
      );

      logger.success(`DELETE ${label.name}`);

      await sleep(120);
    } catch {
      logger.error(`DELETE FAILED ${label.name}`);
    }
  }

  /**
   * -------------------------
   * CREATE PHASE
   * -------------------------
   */
  logger.info('Creating template labels...');

  for (const label of templateLabels) {
    if (dryRun) {
      logger.debug(`[DRY-RUN][CREATE] ${label.name}`);
      continue;
    }

    try {
      await retry(() =>
        githubRequest.createLabel(owner, repo, {
          name: label.name,
          color: label.color,
          description: label.description ?? '',
        })
      );

      logger.success(`CREATE ${label.name}`);

      await sleep(120);
    } catch {
      logger.error(`CREATE FAILED ${label.name}`);
    }
  }
}