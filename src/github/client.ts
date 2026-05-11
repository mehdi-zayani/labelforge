import { Octokit } from "@octokit/rest";
import { getGitHubToken } from "../env/env.js";

export const octokit: Octokit = new Octokit({
  auth: getGitHubToken()
});