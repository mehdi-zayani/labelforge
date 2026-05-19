import "dotenv/config";
import { parseArgs } from "./parse-args.js";
import { cliRunner } from "./core/cli-runner.js";
import { logger } from "../utils/logger.js";

async function main() {
  const args = process.argv.slice(2);
  const context = parseArgs(args);

  if (!context.command || !context.owner || !context.repo) {
    logger.error("Invalid CLI usage");
    logger.info("Usage: labelforge <command> <owner> <repo> [--dry-run]");
    process.exit(1);
  }

  try {
    await cliRunner(context.command, context);
  } catch (error) {
    logger.error("CLI execution failed");
    logger.debug(String(error));
    process.exit(1);
  }
}

main();