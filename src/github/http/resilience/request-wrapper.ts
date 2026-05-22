import { retry } from "./retry.js";
import { octokit } from "../../client/github.client.js";

export const githubRequest = {
  async fetchLabels(owner: string, repo: string) {
    return retry(() =>
      octokit.issues.listLabelsForRepo({ owner, repo })
    );
  },

  async createLabel(owner: string, repo: string, payload: any) {
    return retry(() =>
      octokit.issues.createLabel({ owner, repo, ...payload })
    );
  },

  async updateLabel(
    owner: string,
    repo: string,
    currentName: string,
    payload: any
  ) {
    return retry(() =>
      octokit.issues.updateLabel({
        owner,
        repo,
        name: currentName,
        ...payload,
      })
    );
  },

  async deleteLabel(owner: string, repo: string, name: string) {
    return retry(() =>
      octokit.issues.deleteLabel({ owner, repo, name })
    );
  },
};