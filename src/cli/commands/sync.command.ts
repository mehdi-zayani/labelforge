import { validateRepositoryAccess } from "../../github/validation/repo.validator.js";
import { runSyncPipeline } from "../../application/sync.pipeline.usecase.js";

import { printSplash } from "../ui/splash.js";
import { step } from "../ui/steps.js";
import { runAction } from "../ui/action.js";

export async function syncCommand(
  owner: string,
  repo: string,
  templatePath: string,
  dryRun: boolean
) {
  printSplash();

  try {
    // STEP 1 — validate repo
    step("validate repository", 1, 3);

    const ok = await runAction(
      "validating repository",
      () => validateRepositoryAccess(owner, repo)
    );

    if (!ok) {
      throw new Error("Invalid repository or access denied");
    }

    // STEP 2 — resolve template
    step("resolve template", 2, 3);

    const templatePath = await runAction(
      "resolving template",
      () => resolveTemplate(templateInput)
    );

    if (!templatePath) {
      throw new Error("Template resolution failed");
    }

    // STEP 3 — sync pipeline
    step("run sync pipeline", 3, 3);

    const result = await runAction(
      "syncing labels",
      () =>
        runSyncPipeline(
          owner,
          repo,
          templatePath,
          dryRun
        )
    );

    // SUMMARY (clean UX)
    console.log("\n");

    console.log("Summary");
    console.log(`Remote   : ${result.remoteCount}`);
    console.log(`Template : ${result.templateCount}`);

    console.log("\nDone");
  } catch (err: any) {
    console.error("\n");
    console.error("Error:", err.message ?? err);
    process.exit(1);
  }
<<<<<<< Updated upstream

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

  logger.success("Done");
=======
>>>>>>> Stashed changes
}