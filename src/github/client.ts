import { Octokit } from "@octokit/rest";

import { getGitHubToken } from "../env/env.js";
import { logger } from "../utils/logger.js";

const token = getGitHubToken();

if (!token) {
  logger.error("Missing GitHub token in environment");
  throw new Error("GitHub token is required");
}

logger.debug("GitHub Octokit client initialized");

export const octokit: Octokit = new Octokit({
  auth: token,
});