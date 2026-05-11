import { logger } from "./utils/logger.js";

function bootstrap() {
  logger.info("Labelforge initializing...");
  logger.success("CLI initialized");
}

bootstrap();