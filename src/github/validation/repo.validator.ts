import { octokit } from "../client/github.client.js";
import { handleGitHubError } from "../handlers/github-error.handler.js";
import { logger } from "../../utils/logger.js";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function validateRepositoryAccess(
  owner: string,
  repo: string
): Promise<boolean> {
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      await octokit.repos.get({
        owner,
        repo,
      });

      logger.success(`Repository validated: ${owner}/${repo}`);
      return true;
    } catch (error: any) {
      const status = error?.status;
      attempts++;

     
      if (status >= 500 && attempts < maxAttempts) {
        logger.warn(
          `[GitHub] 5xx error on repo validation - retry ${attempts}/${maxAttempts}`
        );
        await sleep(800 * attempts);
        continue;
      }

      handleGitHubError(error, "validateRepositoryAccess");

      if (status === 404) {
        logger.error("Repository not found or not accessible");
      } else if (status === 401) {
        logger.error("Unauthorized access - invalid GitHub token");
      } else {
        logger.error("Repository validation failed");
      }

      return false;
    }
  }

  logger.error("Repository validation failed after retries");
  return false;
}