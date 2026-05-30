import { validateRepositoryAccess } from '../../github/validation/repo.validator.js';
import { runSyncPipeline } from '../../application/sync.pipeline.usecase.js';

import { step } from '../ui/steps.js';
import { runAction } from '../ui/action.js';

import { resolveTemplate } from '../utils/template-resolver.js';
import { logger } from '../../utils/logger.js';
import { isJson, isVerbose } from '../ui/output-mode.js';

export async function syncCommand(
  owner: string,
  repo: string,
  templateInput: string | undefined,
  dryRun: boolean
) {
  try {
    // STEP 1 — validate repo
    step('validate repository', 1, 3);

    const ok = await runAction('validating repository', () =>
      validateRepositoryAccess(owner, repo)
    );

    if (!ok) {
      throw new Error('Invalid repository or access denied');
    }

    if (isVerbose()) {
      logger.debug('[SYNC] repository validated');
    }

    // STEP 2 — resolve template
    step('resolve template', 2, 3);

    const templatePath = await runAction('resolving template', () =>
      resolveTemplate(templateInput)
    );

    if (!templatePath) {
      throw new Error('Template resolution failed');
    }

    if (isVerbose()) {
      logger.debug(`[SYNC] template resolved: ${templatePath}`);
    }

    // STEP 3 — sync pipeline
    step('run sync pipeline', 3, 3);

    const result = await runAction('syncing labels', () =>
      runSyncPipeline(owner, repo, templatePath, dryRun)
    );

    // SUMMARY
    if (isJson()) {
      console.log(
        JSON.stringify({
          remote: result.remoteCount,
          template: result.templateCount,
          status: 'success',
        })
      );
      return;
    }

    console.log('\nSummary');
    console.log(`Remote   : ${result.remoteCount}`);
    console.log(`Template : ${result.templateCount}`);

    console.log('\nDone');
  } catch (err: any) {
    logger.error(err?.message ?? String(err));
    process.exit(1);
  }
}
