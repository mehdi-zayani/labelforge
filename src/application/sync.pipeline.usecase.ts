/**
 * -------------------------
 * SYNC PIPELINE USE CASE
 * -------------------------
 * Orchestrates full label synchronization flow.
 *
 * Responsibilities:
 * - load template from filesystem
 * - fetch GitHub labels
 * - normalize data for engine
 * - call sync engine
 * - return execution summary
 */

import { loadLabelConfig } from '../infrastructure/config/load-label-config.js';
import { githubRequest } from '../github/request/github-request.wrapper.js';
import { syncEngine } from './sync.engine.js';

/**
 * -------------------------
 * PIPELINE ENTRYPOINT
 * -------------------------
 */
export async function runSyncPipeline(
  owner: string,
  repo: string,
  templatePath: string,
  dryRun: boolean
) {
  /**
   * LOAD TEMPLATE LABELS
   */
  const templateLabels = loadLabelConfig(templatePath);

  /**
   * FETCH REMOTE LABELS FROM GITHUB
   */
  const remoteRaw = await githubRequest.fetchLabels(owner, repo);

  /**
   * NORMALIZE REMOTE LABELS
   * Ensures consistent structure for engine input
   */
  const remoteLabels = remoteRaw.map((l) => ({
    name: l.name,
    color: l.color,
    description: l.description ?? '',
  }));

  /**
   * NORMALIZE TEMPLATE LABELS
   */
  const normalizedTemplate = templateLabels.map((l) => ({
    name: l.name,
    color: l.color,
    description: l.description ?? '',
  }));

  /**
   * EXECUTE SYNC ENGINE
   */
  await syncEngine(owner, repo, remoteLabels, normalizedTemplate, dryRun);

  /**
   * PIPELINE RESULT
   */
  return {
    remoteCount: remoteLabels.length,
    templateCount: templateLabels.length,
  };
}