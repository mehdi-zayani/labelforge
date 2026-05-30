/**
 * -------------------------
 * APPLY COMMAND
 * -------------------------
 */

import { loadTemplate } from '../../templates/loader/load-template.js';
import { diffTemplate } from '../../templates/engine/template.diff.js';
import { applyTemplate } from '../../templates/engine/template.apply.js';
import { githubRequest } from '../../github/request/github-request.wrapper.js';

import path from 'path';
import type { GitHubLabelTemplate } from '../../templates/types/template.types.js';

/**
 * -------------------------
 * APPLY CLI FLOW
 * -------------------------
 * Executes full label sync pipeline:
 * - load template
 * - fetch GitHub labels
 * - compute diff
 * - preview changes
 * - apply changes (unless dry-run)
 */
export async function applyCommand(
  owner: string,
  repo: string,
  templatePath: string,
  dryRun: boolean
) {
  /**
   * -------------------------
   * TEMPLATE LOADING
   * -------------------------
   */
  const template = loadTemplate(
    path.resolve(process.cwd(), templatePath)
  ) as GitHubLabelTemplate;

  /**
   * -------------------------
   * FETCH GITHUB LABELS
   * -------------------------
   */
  const githubLabels = await githubRequest.fetchLabels(owner, repo);

  /**
   * -------------------------
   * NORMALIZE TEMPLATE LABELS
   * -------------------------
   */
  const labels = template.templates.flatMap((t) =>
    (t.labels ?? []).map((l) => ({
      name: l.name,
      color: l.color,
      description: l.description ?? '',
    }))
  );

  /**
   * -------------------------
   * DIFF CALCULATION
   * -------------------------
   */
  const diff = diffTemplate(labels, githubLabels);

  /**
   * -------------------------
   * PREVIEW OUTPUT
   * -------------------------
   */
  console.log('\n--- PREVIEW ---');
  console.log(
    'To create:',
    diff.toCreate.map((l) => l.name)
  );
  console.log(
    'To update:',
    diff.toUpdate.map((l) => l.next.name)
  );
  console.log(
    'To ignore:',
    diff.toIgnore.map((l) => l.name)
  );

  /**
   * -------------------------
   * APPLY PHASE
   * -------------------------
   */
  if (!dryRun) {
    await applyTemplate(owner, repo, diff, false);
  }
}