import { syncCommand } from "./cli/commands/sync.command.js";
import { loginCommand } from "./cli/commands/login.command.js";

async function main() {
  const args = process.argv.slice(2);

  const command = args[0];

  switch (command) {
    case "sync": {
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

      return syncCommand(owner, repo, templatePath, dryRun);
    }

    case "login": {
      return loginCommand();
    }

    default:
      throw new Error("Usage: sync|login ...");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});