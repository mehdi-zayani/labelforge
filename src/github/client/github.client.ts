import { Octokit } from "@octokit/rest";
import { logger } from "../../utils/logger.js";
import { readConfig } from "../../cli/config/config.store.js";

function getToken(): string | null {
  const config = readConfig();
  return config.token;
}

const token = getToken();

if (!token) {
  logger.error("Missing GitHub token. Please run: labelforge login");
  throw new Error("GitHub token is required");
}

logger.debug("GitHub Octokit client initialized");

export const octokit: Octokit = new Octokit({
  auth: token,
});