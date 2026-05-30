/**
 * -------------------------
 * APPLY TEMPLATE
 * -------------------------
 */

import { githubRequest } from '../../github/request/github-request.wrapper.js';

/**
 * -------------------------
 * TEMPLATE APPLICATION FLOW
 * -------------------------
 * Applies a label template diff to a GitHub repository.
 *
 * Supports:
 * - creation of missing labels
 * - update of existing labels
 * - dry-run mode (no side effects)
 */
export async function applyTemplate(
  owner: string,
  repo: string,
  diff: any,
  dryRun: boolean
) {
  const { toCreate, toUpdate } = diff;

  /**
   * -------------------------
   * APPLY PLAN SUMMARY
   * -------------------------
   */
  console.log('\n--- APPLY PLAN ---');
  console.log('To create:', toCreate.length);
  console.log('To update:', toUpdate.length);
  console.log('To ignore:', diff.toIgnore.length);

  /**
   * -------------------------
   * DRY RUN MODE
   * -------------------------
   */
  if (dryRun) {
    console.log('\n[DRY-RUN] No changes applied');
    return;
  }

  /**
   * -------------------------
   * CREATE LABELS
   * -------------------------
   */
  for (const label of toCreate) {
    await githubRequest.createLabel(owner, repo, label);
  }

  /**
   * -------------------------
   * UPDATE LABELS
   * -------------------------
   */
  for (const item of toUpdate) {
    await githubRequest.updateLabel(
      owner,
      repo,
      item.current.name,
      item.next
    );
  }

  /**
   * -------------------------
   * SUCCESS OUTPUT
   * -------------------------
   */
  console.log('\n[SUCCESS] Template applied successfully');
}