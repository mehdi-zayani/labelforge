import { loadLabelConfig } from "../loaders/load-label-config.js";
import { fetchLabels } from "../github/labels.api.js";
import { compareLabels } from "./label-compare.usecase.js";
import { syncLabels } from "./sync.usecase.js";

export async function runSyncPipeline(
  owner: string,
  repo: string,
  dryRun: boolean
) {
    const localLabels = loadLabelConfig();
    const remoteLabels = await fetchLabels(owner, repo);

    const normalizedLocal = localLabels.map((l) => ({
    name: l.name,
    color: l.color,
    description: l.description ?? "",
    }));

    const normalizedRemote = remoteLabels.map((l) => ({
    name: l.name,
    color: l.color,
    description: l.description ?? "",
    }));

    const diff = compareLabels(normalizedLocal, normalizedRemote);

  await syncLabels(owner, repo, diff, dryRun);

  return diff;
}