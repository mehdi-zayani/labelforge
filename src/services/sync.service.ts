import type { LabelComparison } from "../types/label-comparison.js";
import { createLabel, deleteLabel, updateLabel } from "./label-sync.service.js";

export async function syncLabels(
  owner: string,
  repo: string,
  diff: LabelComparison,
  dryRun: boolean = false
) {
  // CREATE
  for (const label of diff.toCreate) {
    if (dryRun) {
      console.log(`[DRY-RUN] CREATE ${label.name}`);
      continue;
    }

    await createLabel(owner, repo, label);
  }

  // UPDATE
  for (const label of diff.toUpdate) {
    if (dryRun) {
      console.log(`[DRY-RUN] UPDATE ${label.name}`);
      continue;
    }

    await updateLabel(owner, repo, label);
  }

  // DELETE
  for (const label of diff.toDelete) {
    if (dryRun) {
      console.log(`[DRY-RUN] DELETE ${label.name}`);
      continue;
    }

    await deleteLabel(owner, repo, label.name);
  }
}