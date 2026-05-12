import { octokit } from "./client.js";

export async function fetchLabels(owner: string, repo: string) {
  const { data } = await octokit.issues.listLabelsForRepo({
    owner,
    repo,
  });

  return data;
}

export async function createLabel(
  owner: string,
  repo: string,
  label: { name: string; color: string; description?: string }
) {
  await octokit.issues.createLabel({
    owner,
    repo,
    name: label.name,
    color: label.color,
    description: label.description ?? "",
  });
}

export async function updateLabel(
  owner: string,
  repo: string,
  currentName: string,
  label: { name: string; color: string; description?: string }
) {
  await octokit.issues.updateLabel({
    owner,
    repo,
    name: currentName,
    new_name: label.name,
    color: label.color,
    description: label.description ?? "",
  });
}

export async function deleteLabel(
  owner: string,
  repo: string,
  name: string
) {
  await octokit.issues.deleteLabel({
    owner,
    repo,
    name,
  });
}