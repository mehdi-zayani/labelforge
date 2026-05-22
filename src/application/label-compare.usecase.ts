import type { Label } from "../domain/label.js";
import type { GitHubLabel } from "../github/api/labels.api.js";
import type { LabelComparison } from "../domain/label-compare.js";

const normalize = (labels: GitHubLabel[]): Label[] =>
  labels.map((l) => ({
    name: l.name,
    color: l.color,
    description: l.description ?? ""
  }));

export function compareLabels(local: Label[], remote: GitHubLabel[]): LabelComparison {
  const normalizedRemote = normalize(remote);


  return {
    toCreate: [],
    toUpdate: [],
    toDelete: []
  };
}