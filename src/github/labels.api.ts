import { handleGitHubError } from "./github-error.handler.js";
import { handleRateLimit } from "./rate-limit.handler.js";

import { logger } from "../utils/logger.js";
import { githubRequest } from "./resilience/request-wrapper.js";

export async function fetchLabels(owner: string, repo: string) {
  try {
    logger.debug(`Fetching labels from ${owner}/${repo}`);

    const response = await githubRequest.fetchLabels(owner, repo);

    handleRateLimit(response.headers);

    logger.success(`Fetched ${response.data.length} GitHub labels`);

    return response.data;
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
    logger.debug(`Creating label ${label.name}`);

    const response = await githubRequest.createLabel(owner, repo, {
      name: label.name,
      color: label.color,
      description: label.description ?? "",
    });

    handleRateLimit(response.headers);

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
    logger.debug(`Updating label ${currentName}`);

    const response = await githubRequest.updateLabel(
      owner,
      repo,
      currentName,
      {
        name: label.name,
        color: label.color,
        description: label.description ?? "",
      }
    );

    handleRateLimit(response.headers);

    logger.success(`Label updated: ${label.name}`);
  } catch (error) {
    handleGitHubError(error, "updateLabel");
    throw error;
  }
}

export async function deleteLabel(
  owner: string,
  repo: string,
  name: string
) {
  try {
    logger.debug(`Deleting label ${name}`);

    const response = await githubRequest.deleteLabel(owner, repo, name);

    handleRateLimit(response.headers);

    logger.success(`Label deleted: ${name}`);
  } catch (error) {
    handleGitHubError(error, "deleteLabel");
    throw error;
  }
}