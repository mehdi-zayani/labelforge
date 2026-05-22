import { handleGitHubError } from "../handlers/github-error.handler.js";

import { logger } from "../../utils/logger.js";
import { githubRequest } from "../http/github-request.wrapper.js";

export async function fetchLabels(owner: string, repo: string) {
  try {
    logger.debug(`Fetching labels from ${owner}/${repo}`);

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
    logger.debug(`Creating label ${label.name}`);

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
    logger.debug(`Updating label ${currentName}`);

    await githubRequest.updateLabel(
      owner,
      repo,
      currentName,
      {
        name: label.name,
        color: label.color,
        description: label.description ?? "",
      }
    );

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

    await githubRequest.deleteLabel(owner, repo, name);

    logger.success(`Label deleted: ${name}`);
  } catch (error) {
    handleGitHubError(error, "deleteLabel");
    throw error;
  }
}