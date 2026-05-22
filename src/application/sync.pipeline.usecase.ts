import { loadLabelConfig } from "../infrastructure/config/load-label-config.js";
import { fetchLabels } from "../github/api/labels.api.js";
import { compareLabels } from "./label-compare.usecase.js";
import { syncLabels } from "./sync.usecase.js";

export async function runSyncPipeline(
  owner: string,
  repo: string,
  dryRun: boolean
) {
  const localLabels = loadLabelConfig();
  const remoteLabels = await fetchLabels(owner, repo);

    const normalizedLocalLabels = localLabels.map((l) => ({
      ...l,
      description: l.description ?? ""
    }));

const diff = compareLabels(normalizedLocalLabels, remoteLabels);

  

  return diff;
}