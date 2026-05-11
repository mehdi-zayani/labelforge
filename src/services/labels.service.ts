import { octokit } from "../github/client.js";

export async function fetchLabels(owner: string, repo: string) {
  try {
    const { data } = await octokit.issues.listLabelsForRepo({
      owner,
      repo,
      per_page: 100
    });

    return data;
  } catch (error) {
    console.error("[ERROR] Failed to fetch GitHub labels");
    throw error;
  }
}