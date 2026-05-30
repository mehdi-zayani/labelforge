import { loadLabelConfig } from '../infrastructure/config/load-label-config.js';
import { fetchLabels } from '../github/api/labels.api.js';
import { syncLabels } from './sync.usecase.js';

export async function runSyncPipeline(
  owner: string,
  repo: string,
  templatePath: string,
  dryRun: boolean
) {
  const templateLabels = loadLabelConfig(templatePath);
  const remoteLabels = await fetchLabels(owner, repo);

  await syncLabels(owner, repo, remoteLabels, templateLabels, dryRun);

  return {
    remoteCount: remoteLabels.length,
    templateCount: templateLabels.length,
  };
}
