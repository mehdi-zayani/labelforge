import type { LabelComparison } from "../types/label-comparison.js";

import {
  createLabel,
  deleteLabel,
  updateLabel
} from "../github/labels.api.js";

export async function syncLabels(
  owner: string,
  repo: string,
  diff: LabelComparison,
  dryRun: boolean = false
) {
  // CREATE
  for (const label of diff.toCreate) {
    if (dryRun) {
      console.log(`[DRY-RUN][CREATE] ${label.name}`);
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

    console.log(`[CREATE] ${label.name}`);
  }

  // UPDATE
  for (const label of diff.toUpdate) {
    if (dryRun) {
      console.log(`[DRY-RUN][UPDATE] ${label.name}`);
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

    console.log(`[UPDATE] ${label.name}`);
  }

  // DELETE
  for (const label of diff.toDelete) {
    try {
      if (dryRun) {
        console.log(`[DRY-RUN][DELETE] ${label.name}`);
        continue;
      }

      await deleteLabel(owner, repo, label.name);

      console.log(`[DELETE] ${label.name}`);
    } catch (err) {
      console.error(`[DELETE FAILED] ${label.name}`, err);
    }
  }
}