import { parseTemplate } from "../../templates/parser/template.parser.js";
import { diffTemplate } from "../../templates/engine/template.diff.js";
import { applyTemplate } from "../../templates/engine/template.apply.js";
import { githubRequest } from "../../github/client/github-request.wrapper.js";

import path from "path";
import type { GitHubLabelTemplate } from "../../templates/types/template.types.js";

export async function applyCommand(
  owner: string,
  repo: string,
  templatePath: string,
  dryRun: boolean
) {
  const template = parseTemplate(
    path.resolve(process.cwd(), templatePath)
  ) as GitHubLabelTemplate;


  const githubLabels = await githubRequest.fetchLabels(owner, repo);

  const labels = template.templates.flatMap((t) =>
  (t.labels ?? []).map((l) => ({
    name: l.name,
    color: l.color,
    description: l.description ?? ""
  }))
);

  const diff = diffTemplate(labels, githubLabels);

  console.log("\n--- PREVIEW ---");
  console.log("To create:", diff.toCreate.map((l) => l.name));
  console.log("To update:", diff.toUpdate.map((l) => l.next.name));
  console.log("To ignore:", diff.toIgnore.map((l) => l.name));

  
if (!dryRun) {
  await applyTemplate(owner, repo, diff, false);
}
}