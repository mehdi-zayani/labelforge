import { syncCommand } from "./commands/sync.command.js";

async function main() {
  const args = process.argv.slice(2);

  const command = args[0];
  const owner = args[1];
  const repo = args[2];
  const dryRun = args.includes("--dry-run");

  if (command !== "sync" || !owner || !repo) {
    console.log("Usage: labelforge sync <owner> <repo> [--dry-run]");
    process.exit(1);
  }

  await syncCommand(owner, repo, dryRun);
}

main();