import type { Label } from "../domain/label.js";
import type { GitHubLabel } from "../github/api/labels.api.js";
import type { LabelComparison } from "../domain/label-compare.js";

const normalize = (labels: GitHubLabel[]): Label[] =>
  labels.map((l) => ({
    name: l.name,
    color: l.color,
    description: l.description ?? ""
  }));

export function compareLabels(
  local: Label[],
  remote: GitHubLabel[]
): LabelComparison {
  const normalizedRemote = normalize(remote);

  return {
    toCreate: local.filter(
      (l) => !normalizedRemote.some((r) => r.name === l.name)
    ),

    toUpdate: local
      .map((localLabel) => {
        const remoteLabel = normalizedRemote.find(
          (r) => r.name === localLabel.name
        );

        if (!remoteLabel) return null;

        const changed =
          remoteLabel.color !== localLabel.color ||
          remoteLabel.description !== localLabel.description;

        if (!changed) return null;

        return {
          current: remoteLabel,
          next: localLabel
        };
      })
      .filter(Boolean) as LabelComparison["toUpdate"],

    toDelete: normalizedRemote.filter(
      (remoteLabel) =>
        !local.some((localLabel) => localLabel.name === remoteLabel.name)
    )
  };
}