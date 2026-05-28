import { octokit } from "./github.client.js";

export type GitHubLabel = {
  name: string;
  color: string;
  description: string | null;
};

export const githubRequest = {
  async fetchLabels(owner: string, repo: string): Promise<GitHubLabel[]> {
    const res = await octokit.rest.issues.listLabelsForRepo({
      owner,
      repo,
    });

    return res.data.map((l) => ({
      name: l.name,
      color: l.color,
      description: l.description ?? null,
    }));
  },

  async createLabel(owner: string, repo: string, payload: GitHubLabel) {
    return octokit.rest.issues.createLabel({
      owner,
      repo,
      name: payload.name,
      color: payload.color,
      description: payload.description ?? "",
    });
  },

  async updateLabel(
    owner: string,
    repo: string,
    currentName: string,
    payload: GitHubLabel
  ) {
    return octokit.rest.issues.updateLabel({
      owner,
      repo,
      name: currentName,
      new_name: payload.name,
      color: payload.color,
      description: payload.description ?? "",
    });
  },

  async deleteLabel(owner: string, repo: string, name: string) {
    return octokit.rest.issues.deleteLabel({
      owner,
      repo,
      name,
    });
  },
};