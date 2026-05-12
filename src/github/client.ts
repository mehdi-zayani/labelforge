import { Octokit } from "@octokit/rest";
import { getGitHubToken } from "../env/env.js";

const token = getGitHubToken();

if (!token) {
  throw new Error("[GITHUB] Missing GitHub token in environment");
}

export const octokit: Octokit = new Octokit({
  auth: token
});