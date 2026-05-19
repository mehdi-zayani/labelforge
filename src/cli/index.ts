import "dotenv/config";

import { parseArgs } from "./parse-args.js";
import { cliRunner } from "./core/cli-runner.js";
import { setCliContext } from "./context/cli.context.js";
import { handleCliError } from "./core/cli-error.handler.js";
import { logger } from "../utils/logger.js";

async function main() {
  const args = process.argv.slice(2);

  const context = parseArgs(args);

  setCliContext({
    verbose: context.verbose,
  });

  if (!context.command || !context.owner || !context.repo) {
    logger.error("Invalid CLI usage");
    logger.info("Usage: labelforge <command> <owner> <repo> [--dry-run] [--verbose]");
    process.exit(1);
  }

  try {
    await cliRunner(context.command, context);
  } catch (error) {
    handleCliError(error);
  }
}

main();