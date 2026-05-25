import type { GitHubLabel } from "../github/api/labels.api.js";

import {
  createLabel,
  deleteLabel,
} from "../github/api/labels.api.js";

import { logger } from "../utils/logger.js";

export async function syncLabels(
  owner: string,
  repo: string,
  remoteLabels: GitHubLabel[],
  templateLabels: GitHubLabel[],
  dryRun: boolean = true
){
  logger.info("Cleaning existing labels...");

  for (const label of remoteLabels) {
    if (dryRun) {
      logger.debug(`[DRY-RUN][DELETE] ${label.name}`);
      continue;
    }

    try {
      await deleteLabel(owner, repo, label.name);
      logger.success(`DELETE ${label.name}`);
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
      await createLabel(owner, repo, {
        name: label.name,
        color: label.color,
        description: label.description ?? "",
      });

      logger.success(`CREATE ${label.name}`);
    } catch {
      logger.error(`CREATE FAILED ${label.name}`);
    }
  }
}