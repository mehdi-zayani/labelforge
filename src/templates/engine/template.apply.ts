import { githubRequest } from '../../github/request/github-request.wrapper.js';

export async function applyTemplate(
  owner: string,
  repo: string,
  diff: any,
  dryRun: boolean
) {
  const { toCreate, toUpdate } = diff;

  console.log('\n--- APPLY PLAN ---');
  console.log('To create:', toCreate.length);
  console.log('To update:', toUpdate.length);
  console.log('To ignore:', diff.toIgnore.length);

  if (dryRun) {
    console.log('\n[DRY-RUN] No changes applied');
    return;
  }

  for (const label of toCreate) {
    await githubRequest.createLabel(owner, repo, label);
  }

  for (const item of toUpdate) {
    await githubRequest.updateLabel(owner, repo, item.current.name, item.next);
  }

  console.log('\n[SUCCESS] Template applied successfully');
}
