import type { LabelComparison } from "../domain/label-comparison.js";

import {
  createLabel,
  deleteLabel,
  updateLabel
} from "../github/labels.api.js";

import { logger } from "../utils/logger.js";

export async function syncLabels(
  owner: string,
  repo: string,
  diff: LabelComparison,
  dryRun: boolean = false
) {
  // CREATE
  for (const label of diff.toCreate) {
    if (dryRun) {
      logger.debug(`[DRY-RUN][CREATE] ${label.name}`);
      continue;
    }

    const payload: any = {
      name: label.name,
      color: label.color
    };

    if (label.description) {
      payload.description = label.description;
    }

    await createLabel(owner, repo, payload);

    logger.success(`CREATE ${label.name}`);
  }

  // UPDATE
  for (const label of diff.toUpdate) {
    if (dryRun) {
      logger.debug(`[DRY-RUN][UPDATE] ${label.name}`);
      continue;
    }

    const payload: any = {
      name: label.name,
      color: label.color
    };

    if (label.description) {
      payload.description = label.description;
    }

    await updateLabel(owner, repo, label.name, payload);

    logger.success(`UPDATE ${label.name}`);
  }

  // DELETE
  for (const label of diff.toDelete) {
    try {
      if (dryRun) {
        logger.debug(`[DRY-RUN][DELETE] ${label.name}`);
        continue;
      }

      await deleteLabel(owner, repo, label.name);

      logger.success(`DELETE ${label.name}`);
    } catch (error) {
      logger.error(`DELETE FAILED ${label.name}`);
      logger.debug(String(error));
    }
  }
}