import { retry } from "../resilience/retry.js";
import { getOctokit } from "./github.client.js";

export const githubRequest = {
  async fetchLabels(owner: string, repo: string) {
    return retry(() =>
      getOctokit().rest.issues.listLabelsForRepo({ owner, repo })
    );
  },

  async createLabel(owner: string, repo: string, payload: any) {
    return retry(() =>
      getOctokit().rest.issues.createLabel({
        owner,
        repo,
        ...payload,
      })
    );
  },

  async updateLabel(
    owner: string,
    repo: string,
    currentName: string,
    payload: any
  ) {
    return retry(() =>
      getOctokit().rest.issues.updateLabel({
        owner,
        repo,
        name: currentName,
        ...payload,
      })
    );
  },

  async deleteLabel(owner: string, repo: string, name: string) {
    return retry(() =>
      getOctokit().rest.issues.deleteLabel({
        owner,
        repo,
        name,
      })
    );
  },
};