import { octokit } from "../github/client.js";

export async function fetchLabels(owner: string, repo: string) {
  const { data } = await octokit.issues.listLabelsForRepo({
    owner,
    repo,
  });

  return data;
}