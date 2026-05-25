import chalk from "chalk";
import figlet from "figlet";
import prompts from "prompts";

import { validateRepositoryAccess } from "../../github/validation/repo.validator.js";
import { logger } from "../../utils/logger.js";
import { runSyncPipeline } from "../../application/sync.pipeline.usecase.js";

export async function syncCommand(
  owner: string,
  repo: string,
  templatePath: string,
  dryRun: boolean
) {
  console.log(
    chalk.cyan(
      figlet.textSync("Labelforge", {
        horizontalLayout: "default",
      })
    )
  );

  logger.info("STEP 0 - Validate repo");

  const ok = await validateRepositoryAccess(owner, repo);

  if (!ok) {
    logger.error("Invalid repository");
    return;
  }

  logger.info("STEP 1 - Run sync pipeline");

  const result = await runSyncPipeline(
    owner,
    repo,
    templatePath,
    dryRun
  );

  logger.warn("Summary");
  logger.info(`Remote: ${result.remoteCount}`);
  logger.info(`Template: ${result.templateCount}`);

  if (dryRun) {
    logger.warn("Dry-run mode");
    return;
  }

  const response = await prompts({
    type: "confirm",
    name: "confirm",
    message: "Apply changes?",
    initial: false,
  });

  if (!response.confirm) {
    logger.warn("Cancelled");
    return;
  }

  logger.success("Done");
}