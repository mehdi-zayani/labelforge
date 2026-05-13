import "dotenv/config";

import { syncCommand } from "./commands/sync.command.js";
import { parseArgs } from "./parse-args.js";
import { logger } from "../utils/logger.js";
import { setCliContext } from "./context/cli.context.js";

async function main() {
  const args = process.argv.slice(2);

  const {
    command,
    owner,
    repo,
    dryRun,
    verbose,
  } = parseArgs(args);

  // 👇 initialize CLI context 
  setCliContext({
    verbose: verbose ?? false,
  });

  if (verbose) {
    logger.debug("Verbose mode enabled");
    logger.debug(`Args: ${JSON.stringify({ command, owner, repo, dryRun })}`);
  }

  if (command !== "sync" || !owner || !repo) {
    logger.error("Invalid CLI usage");
    logger.info("Usage: labelforge sync <owner> <repo> [--dry-run] [--verbose]");

    process.exit(1);
  }

  try {
    await syncCommand(owner, repo, dryRun);
  } catch (error) {
    logger.error("Unhandled CLI execution error");

    // verbose only stack / details
    logger.debug(String(error));

    process.exit(1);
  }
}

main();