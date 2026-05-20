import chalk from "chalk";
import figlet from "figlet";
import prompts from "prompts";

import { fetchLabels } from "../../github/labels.api.js";
import { loadLabelConfig } from "../../loaders/load-label-config.js";
import { compareLabels } from "../../core/label-compare.service.js";
import { syncLabels } from "../../application/sync.usecase.js";

import { validateRepositoryAccess } from "../../github/repo.validator.js";

import { logger } from "../../utils/logger.js";

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

  logger.info("STEP 1 - Fetching GitHub labels...");

  const localLabels = loadLabelConfig();
  const remoteLabels = await fetchLabels(owner, repo);

  logger.success(`Local labels loaded: ${localLabels.length}`);
  logger.success(`Remote labels fetched: ${remoteLabels.length}`);

  logger.info("STEP 2 - Comparing labels...");

  const diff = compareLabels(localLabels, remoteLabels);

  logger.warn("Synchronization summary");
  logger.info(`To create : ${diff.toCreate.length}`);
  logger.info(`To update : ${diff.toUpdate.length}`);
  logger.info(`To delete : ${diff.toDelete.length}`);

  logger.info("STEP 3 - Sync execution...");

  if (dryRun) {
    logger.warn("DRY-RUN MODE ENABLED - no changes will be applied");
  } else {
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
  }

  await syncLabels(owner, repo, diff, dryRun);

  logger.success("Synchronization completed successfully\n");
}