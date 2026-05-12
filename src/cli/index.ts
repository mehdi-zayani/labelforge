import "dotenv/config";

import { syncCommand } from "./commands/sync.command.js";
import { parseArgs } from "./parse-args.js";

async function main() {
  const args = process.argv.slice(2);

  const {
    command,
    owner,
    repo,
    dryRun
  } = parseArgs(args);

  if (command !== "sync" || !owner || !repo) {
    console.log("Usage: labelforge sync <owner> <repo> [--dry-run]");
    process.exit(1);
  }

  await syncCommand(owner, repo, dryRun);
}

main();