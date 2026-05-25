import { cliRunner } from "./core/cli-runner.js";

async function main() {
  const args = process.argv.slice(2);

  const command = args[0];
  const owner = args[1];
  const repo = args[2];
  const templateInput = args[3];
  const dryRun = args[4] === "true";

  if (!owner || !repo || !templateInput) {
    throw new Error("Usage: sync owner repo template [dryRun]");
  }

  const templatePath =
    templateInput.endsWith(".yml") || templateInput.endsWith(".yaml")
      ? templateInput
      : `src/templates/presets/${templateInput}.yml`;

  const context = {
    command,
    owner,
    repo,
    templatePath,
    dryRun,
    verbose: false
  };

 
  await cliRunner({
    owner: context.owner!,
    repo: context.repo!,
    templatePath: context.templatePath!,
    dryRun: context.dryRun
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});