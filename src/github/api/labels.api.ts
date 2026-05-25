import { githubRequest } from "../client/github-request.wrapper.js";
import { handleGitHubError } from "../handlers/github-error.handler.js";

export type GitHubLabel = {
  name: string;
  color: string;
  description: string | null;
};

async function safeCall<T>(fn: () => Promise<T>, context: string): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    handleGitHubError(error, context);
    throw error;
  }
}

export async function fetchLabels(owner: string, repo: string) {
  return safeCall(
    async () => {
      const labels = await githubRequest.fetchLabels(owner, repo);

      return labels.map((l) => ({
        ...l,
        description: l.description ?? "",
      }));
    },
    "fetchLabels"
  );
}

export async function createLabel(
  owner: string,
  repo: string,
  payload: GitHubLabel
) {
  return safeCall(
    () => githubRequest.createLabel(owner, repo, payload),
    "createLabel"
  );
}

export async function deleteLabel(owner: string, repo: string, name: string) {
  return safeCall(
    () => githubRequest.deleteLabel(owner, repo, name),
    "deleteLabel"
  );
}