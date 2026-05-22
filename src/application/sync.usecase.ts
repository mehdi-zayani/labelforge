import type { LabelComparison } from "../domain/label-compare.js";

import {
  createLabel,
  deleteLabel,
  updateLabel
} from "../github/api/labels.api.js";

import { logger } from "../utils/logger.js";

export async function syncLabels(
  owner: string,
  repo: string,
  diff: LabelComparison,
  dryRun: boolean = true
) {
  // CREATE
for (const label of diff.toCreate) {
  if (dryRun) {
    logger.debug(`[DRY-RUN][CREATE] ${label.name}`);
    continue;
  }

  const payload: any = {
    name: label.name,
    color: label.color,
  };

  if (label.description) {
    payload.description = label.description;
  }

  await createLabel(owner, repo, payload);

  logger.success(`CREATE ${label.name}`);
}
  // UPDATE
 for (const item of diff.toUpdate) {
  if (dryRun) {
    logger.debug(`[DRY-RUN][UPDATE] ${item.next.name}`);
    continue;
  }

  const payload: any = {
    name: item.next.name,
    color: item.next.color,
  };

  if (item.next.description) {
    payload.description = item.next.description;
  }

  await updateLabel(owner, repo, item.current.name, payload);

  logger.success(`UPDATE ${item.next.name}`);
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