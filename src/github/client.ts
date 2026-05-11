import { Octokit } from "@octokit/rest";
import { getGitHubToken } from "../config/env.js";

export const octokit: Octokit = new Octokit({
  auth: getGitHubToken()
});