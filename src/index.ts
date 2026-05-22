import { parseArgs } from "./cli/parse-args.js";
import { syncCommand } from "./cli/commands/sync.command.js";

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.command === "sync") {
    if (!args.owner || !args.repo) {
      console.error("Missing owner/repo");
      process.exit(1);
    }

    await syncCommand(args.owner, args.repo, args.dryRun);
    return;
  }

  console.error("Unknown command");
}

main();