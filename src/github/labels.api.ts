import { octokit } from "./client.js";
import { handleGitHubError } from "./github-error.handler.js";

export async function fetchLabels(owner: string, repo: string) {
  try {
    const { data } = await octokit.issues.listLabelsForRepo({
      owner,
      repo,
    });

    return data;
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
    await octokit.issues.createLabel({
      owner,
      repo,
      name: label.name,
      color: label.color,
      description: label.description ?? "",
    });
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
    await octokit.issues.updateLabel({
      owner,
      repo,
      name: currentName,
      new_name: label.name,
      color: label.color,
      description: label.description ?? "",
    });
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
    await octokit.issues.deleteLabel({
      owner,
      repo,
      name,
    });
  } catch (error) {
    handleGitHubError(error, "deleteLabel");
    throw error;
  }
}