import type { LabelComparison } from "../types/label-comparison.js";
import { createLabel, deleteLabel, updateLabel } from "./label-sync.service.js";

export async function syncLabels(
  owner: string,
  repo: string,
  diff: LabelComparison
) {
  // CREATE
  for (const label of diff.toCreate) {
    await createLabel(owner, repo, label);
  }

  // UPDATE
  for (const label of diff.toUpdate) {
    await updateLabel(owner, repo, label);
  }

  // DELETE
 for (const label of diff.toDelete) {
  try {
    await deleteLabel(owner, repo, label.name);
    console.log(`[DELETE] ${label.name}`);
  } catch (err) {
    console.error(`[DELETE FAILED] ${label.name}`, err);
  }
}
}