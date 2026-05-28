import { syncCommand } from "./cli/commands/sync.command.js";
import { resolveTemplate } from "./cli/utils/template-resolver.js";

async function main() {
  const args = process.argv.slice(2);

  const command = args[0];

  if (command === "login") {
    const { loginCommand } = await import("./cli/commands/login.command.js");
    await loginCommand();
    return;
  }

  if (command === "sync") {
    const owner = args[1];
    const repo = args[2];
    const templateInput = args[3];
    const dryRun = args.includes("--dry-run");

    if (!owner || !repo) {
      throw new Error("Usage: sync owner repo [template] [--dry-run]");
    }

    const templatePath = resolveTemplate(templateInput);

    await syncCommand(owner, repo, templatePath, dryRun);
    return;
  }

  throw new Error("Usage: login | sync owner repo [template] [--dry-run]");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});