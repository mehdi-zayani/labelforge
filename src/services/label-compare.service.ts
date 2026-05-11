import type { LabelConfig } from "../types/label.js";
import type { LabelComparison } from "../types/label-comparison.js";

export function compareLabels(
  local: LabelConfig[],
  remote: LabelConfig[]
): LabelComparison {
  const toCreate: LabelConfig[] = [];
  const toUpdate: LabelConfig[] = [];
  const toDelete: LabelConfig[] = [];

  const remoteMap = new Map(remote.map(l => [l.name, l]));

  for (const localLabel of local) {
    const remoteLabel = remoteMap.get(localLabel.name);

    if (!remoteLabel) {
      toCreate.push(localLabel);
    } else {
      if (
        remoteLabel.color !== localLabel.color ||
        remoteLabel.description !== localLabel.description
      ) {
        toUpdate.push(localLabel);
      }
    }
  }

  const localNames = new Set(local.map(l => l.name));

  for (const remoteLabel of remote) {
    if (!localNames.has(remoteLabel.name)) {
      toDelete.push(remoteLabel);
    }
  }

  return { toCreate, toUpdate, toDelete };
}