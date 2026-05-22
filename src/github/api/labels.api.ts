import { githubRequest } from "../http/github-request.wrapper.js";
import { logger } from "../../utils/logger.js";
import { handleGitHubError } from "../handlers/github-error.handler.js";
import { handleRateLimit } from "../handlers/rate-limit.handler.js";

export type GitHubLabel = {
  name: string;
  color: string;
  description: string | null;
};

export async function fetchLabels(owner: string, repo: string): Promise<GitHubLabel[]> {
  try {
    const labels = await githubRequest.fetchLabels(owner, repo);

    logger.success(`Fetched ${labels.length} GitHub labels`);

    return labels;
  } catch (error) {
    handleGitHubError(error, "fetchLabels");
    throw error;
  }
}

export async function createLabel(
  owner: string,
  repo: string,
  label: { name: string; color: string; description?: string }
) {
  try {
    await githubRequest.createLabel(owner, repo, {
      name: label.name,
      color: label.color,
      description: label.description ?? "",
    });

    logger.success(`Label created: ${label.name}`);
  } catch (error) {
    handleGitHubError(error, "createLabel");
    throw error;
  }
}

export async function updateLabel(
  owner: string,
  repo: string,
  currentName: string,
  label: { name: string; color: string; description?: string }
) {
  try {
    await githubRequest.updateLabel(owner, repo, currentName, {
      name: label.name,
      color: label.color,
      description: label.description ?? "",
    });

    logger.success(`Label updated: ${label.name}`);
  } catch (error) {
    handleGitHubError(error, "updateLabel");
    throw error;
  }
}

export async function deleteLabel(owner: string, repo: string, name: string) {
  try {
    await githubRequest.deleteLabel(owner, repo, name);

    logger.success(`Label deleted: ${name}`);
  } catch (error) {
    handleGitHubError(error, "deleteLabel");
    throw error;
  }
}