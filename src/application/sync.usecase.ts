import type { GitHubLabel } from "../github/api/labels.api.js";

import {
  createLabel,
  deleteLabel,
} from "../github/api/labels.api.js";

import { logger } from "../utils/logger.js";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

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

export async function syncLabels(
  owner: string,
  repo: string,
  remoteLabels: GitHubLabel[],
  templateLabels: GitHubLabel[],
  dryRun: boolean = true
) {
  logger.info("Cleaning existing labels...");

  for (const label of remoteLabels) {
    if (dryRun) {
      logger.debug(`[DRY-RUN][DELETE] ${label.name}`);
      continue;
    }

    try {
      await retry(() =>
        deleteLabel(owner, repo, label.name)
      );

      logger.success(`DELETE ${label.name}`);

      await sleep(120); // throttle GitHub
    } catch {
      logger.error(`DELETE FAILED ${label.name}`);
    }
  }

  logger.info("Creating template labels...");

  for (const label of templateLabels) {
    if (dryRun) {
      logger.debug(`[DRY-RUN][CREATE] ${label.name}`);
      continue;
    }

    try {
      await retry(() =>
        createLabel(owner, repo, {
          name: label.name,
          color: label.color,
          description: label.description ?? "",
        })
      );

      logger.success(`CREATE ${label.name}`);

      await sleep(120); // throttle GitHub
    } catch {
      logger.error(`CREATE FAILED ${label.name}`);
    }
  }
}