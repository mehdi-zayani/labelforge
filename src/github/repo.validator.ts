import { octokit } from "./client.js";
import { handleGitHubError } from "./github-error.handler.js";

export async function validateRepositoryAccess(
  owner: string,
  repo: string
): Promise<boolean> {
  try {
    await octokit.repos.get({
      owner,
      repo,
    });

    return true;
  } catch (error: any) {
    handleGitHubError(error, "validateRepositoryAccess");

    if (error?.status === 404) {
      console.error("[ERROR] Repository not found or not accessible");
    } else if (error?.status === 401) {
      console.error("[ERROR] Unauthorized access - invalid token");
    } else {
      console.error("[ERROR] Repository validation failed");
    }

    return false;
  }
}