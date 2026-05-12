import "dotenv/config";

import { syncCommand } from "./commands/sync.command.js";
import { parseArgs } from "./parse-args.js";

import { logger } from "../utils/logger.js";

async function main() {
  const args = process.argv.slice(2);

  const {
    command,
    owner,
    repo,
    dryRun
  } = parseArgs(args);

  if (command !== "sync" || !owner || !repo) {
    logger.error("Invalid CLI usage");
    logger.info("Usage: labelforge sync <owner> <repo> [--dry-run]");

    process.exit(1);
  }

  try {
    await syncCommand(owner, repo, dryRun);
  } catch (error) {
    logger.error("Unhandled CLI execution error");
    logger.debug(String(error));

    process.exit(1);
  }
}

main();