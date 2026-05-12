import chalk from "chalk";
import figlet from "figlet";
import prompts from "prompts";

import { fetchLabels } from "../../services/labels.service.js";
import { loadLabelConfig } from "../../loaders/load-label-config.js";
import { compareLabels } from "../../services/label-compare.service.js";
import { syncLabels } from "../../services/sync.service.js";

export async function syncCommand(
  owner: string,
  repo: string,
  dryRun: boolean
) {
        console.log(
        chalk.cyan(
            figlet.textSync("Labelforge", {
            horizontalLayout: "default"
            })
        )
        );

        console.log(chalk.gray("GitHub Labels Synchronization CLI"));
        console.log(chalk.gray("Version 0.1.0"));
        console.log(chalk.gray("Developed by Mehdi Zayani\n"));

  console.log(chalk.blue("[STEP 1] Fetching GitHub labels..."));

  const localLabels = loadLabelConfig();
  const remoteLabels = await fetchLabels(owner, repo);

  console.log(chalk.green(`[DONE] Local labels: ${localLabels.length}`));
  console.log(chalk.green(`[DONE] Remote labels: ${remoteLabels.length}`));

  console.log(chalk.blue("\n[STEP 2] Comparing labels..."));

  const diff = compareLabels(localLabels, remoteLabels);

  console.log(chalk.yellow("\n[SUMMARY]"));
  console.log(`To create : ${diff.toCreate.length}`);
  console.log(`To update : ${diff.toUpdate.length}`);
  console.log(`To delete : ${diff.toDelete.length}`);

  console.log(chalk.blue("\n[STEP 3] Sync execution..."));

  if (dryRun) {
    console.log(chalk.magenta("[DRY-RUN MODE] No changes applied"));
  }
  if (!dryRun) {
  const response = await prompts({
    type: "confirm",
    name: "confirmed",
    message: "Apply changes to GitHub labels?",
    initial: false
  });

  if (!response.confirmed) {
    console.log(chalk.red("\n[ABORTED] Synchronization cancelled\n"));
    return;
  }
}

  await syncLabels(owner, repo, diff, dryRun);

  console.log(chalk.green("\n[SUCCESS] Sync completed\n"));
}