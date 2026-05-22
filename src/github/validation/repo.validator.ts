import { octokit } from "../client/github.client.js";
import { handleGitHubError } from "../handlers/github-error.handler.js";

import { logger } from "../../utils/logger.js";

export async function validateRepositoryAccess(
  owner: string,
  repo: string
): Promise<boolean> {
  try {
    await octokit.repos.get({
      owner,
      repo,
    });

    logger.success(`Repository validated: ${owner}/${repo}`);

    return true;
  } catch (error: any) {
    handleGitHubError(error, "validateRepositoryAccess");

    if (error?.status === 404) {
      logger.error("Repository not found or not accessible");
    } else if (error?.status === 401) {
      logger.error("Unauthorized access - invalid GitHub token");
    } else {
      logger.error("Repository validation failed");
    }

    return false;
  }
}