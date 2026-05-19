import { logger } from "../../utils/logger.js";

export function handleCliError(error: any) {
  logger.error("CLI execution failed");

  if (error instanceof Error) {
    logger.error(error.message);
  } else {
    logger.error(String(error));
  }

  process.exit(1);
}