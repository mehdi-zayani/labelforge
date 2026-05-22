import { githubRequest } from "../client/github-request.wrapper.js";
import { handleGitHubError } from "../handlers/github-error.handler.js";

export type GitHubLabel = {
  name: string;
  color: string;
  description: string | null;
};

export async function fetchLabels(owner: string, repo: string): Promise<GitHubLabel[]> {
  try {
    return await githubRequest.fetchLabels(owner, repo);
  } catch (error) {
    handleGitHubError(error, "fetchLabels");
    throw error;
  }
}

export async function createLabel(owner: string, repo: string, payload: any) {
  try {
    return await githubRequest.createLabel(owner, repo, payload);
  } catch (error) {
    handleGitHubError(error, "createLabel");
    throw error;
  }
}

export async function updateLabel(owner: string, repo: string, currentName: string, payload: any) {
  try {
    return await githubRequest.updateLabel(owner, repo, currentName, payload);
  } catch (error) {
    handleGitHubError(error, "updateLabel");
    throw error;
  }
}

export async function deleteLabel(owner: string, repo: string, name: string) {
  try {
    return await githubRequest.deleteLabel(owner, repo, name);
  } catch (error) {
    handleGitHubError(error, "deleteLabel");
    throw error;
  }
}