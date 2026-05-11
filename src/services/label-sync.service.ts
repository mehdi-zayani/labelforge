import { octokit } from "../github/client.js";
import type { LabelConfig } from "../types/label.js";

export async function createLabel(owner: string, repo: string, label: LabelConfig) {
  await octokit.issues.createLabel({
    owner,
    repo,
    name: label.name,
    color: label.color,
    description: label.description ?? ""
  });
}

export async function deleteLabel(owner: string, repo: string, name: string) {
  await octokit.issues.deleteLabel({
    owner,
    repo,
    name
  });
}

export async function updateLabel(
  owner: string,
  repo: string,
  label: LabelConfig
) {
  // GitHub "update" = edit label endpoint
  await octokit.issues.updateLabel({
    owner,
    repo,
    name: label.name,
    color: label.color,
    description: label.description ?? ""
  });
}