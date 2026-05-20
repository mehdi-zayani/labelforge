import type { GitHubLabel } from "../github/http/github-request.wrapper.js";
import type { LabelComparison } from "../domain/label-comparison.js";

export function compareLabels(
  local: GitHubLabel[],
  remote: GitHubLabel[]
): LabelComparison {
  const toCreate: GitHubLabel[] = [];
  const toUpdate: any[] = [];
  const toDelete: GitHubLabel[] = [];

  for (const l of local) {
    const found = remote.find((r) => r.name === l.name);
    if (!found) toCreate.push(l);
  }

  for (const r of remote) {
    const found = local.find((l) => l.name === r.name);
    if (!found) toDelete.push(r);
  }

  return {
    toCreate,
    toUpdate,
    toDelete,
  };
}