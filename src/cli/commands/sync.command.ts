import chalk from "chalk";
import { fetchLabels } from "../../services/labels.service.js";
import { loadLabelConfig } from "../../loaders/load-label-config.js";
import { compareLabels } from "../../services/label-compare.service.js";
import { syncLabels } from "../../services/sync.service.js";

export async function syncCommand(owner: string, repo: string, dryRun: boolean) {
  console.log(chalk.blue("[INFO] Starting sync..."));

  if (dryRun) {
    console.log(chalk.magenta("[DRY-RUN MODE ENABLED]"));
  }

  const localLabels = loadLabelConfig();
  const remoteLabels = await fetchLabels(owner, repo);

  const diff = compareLabels(localLabels, remoteLabels);

  console.log(chalk.yellow("[COMPARE RESULT]"), {
    create: diff.toCreate.length,
    update: diff.toUpdate.length,
    delete: diff.toDelete.length
  });

  await syncLabels(owner, repo, diff, dryRun);
}