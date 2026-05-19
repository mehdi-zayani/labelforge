import type { GitHubLabelTemplate } from "../types/template.types.js";

export function validateTemplate(template: GitHubLabelTemplate) {
  if (!template.version) {
    throw new Error("Template missing version");
  }

  if (!template.templates || !Array.isArray(template.templates)) {
    throw new Error("Invalid templates structure");
  }

  for (const group of template.templates) {
    if (!group.group) {
      throw new Error("Template group missing name");
    }

    if (!Array.isArray(group.labels)) {
      throw new Error(`Invalid labels in group ${group.group}`);
    }
  }

  return true;
}