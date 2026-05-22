import chalk from "chalk";
import figlet from "figlet";
import prompts from "prompts";

import { validateRepositoryAccess } from "../../github/validation/repo.validator.js";
import { logger } from "../../utils/logger.js";
import { runSyncPipeline } from "../../application/sync.pipeline.usecase.js";
import { syncLabels } from "../../application/sync.usecase.js";

export async function syncCommand(
  owner: string,
  repo: string,
  dryRun: boolean
) {
  console.log(
    chalk.cyan(
      figlet.textSync("Labelforge", {
        horizontalLayout: "default",
      })
    )
  );

  logger.debug("GitHub Labels Synchronization CLI");
  logger.debug("Version 0.1.0");
  logger.debug("Developed by Mehdi Zayani\n");

  logger.info("STEP 0 - Validating repository access...");

  const isRepoValid = await validateRepositoryAccess(owner, repo);

  if (!isRepoValid) {
    logger.error("Synchronization aborted - invalid repository access");
    return;
  }

  logger.info("STEP 1 - Running sync pipeline...");

  const diff = await runSyncPipeline(owner, repo, false);

  logger.warn("Synchronization summary");
  logger.info(`To create : ${diff.toCreate.length}`);
  logger.info(`To update : ${diff.toUpdate.length}`);
  logger.info(`To delete : ${diff.toDelete.length}`);

logger.info("STEP 2 - Sync execution...");

if (dryRun) {
  logger.warn("DRY-RUN MODE ENABLED - no changes will be applied");
  logger.info(`To create: ${diff.toCreate.length}`);
    logger.info(`To update: ${diff.toUpdate.length}`);
    logger.info(`To delete: ${diff.toDelete.length}`);
  return;
}

const response = await prompts({
  type: "confirm",
  name: "confirmed",
  message: "Apply changes to GitHub labels?",
  initial: false,
});

if (!response.confirmed) {
  logger.warn("Synchronization cancelled by user");
  return;
}


await syncLabels(owner, repo, diff, false);

  logger.success("Synchronization completed successfully\n");
}