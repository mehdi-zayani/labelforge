import type { GitHubLabelTemplate } from '../types/template.types.js';

export function validateTemplate(template: unknown): GitHubLabelTemplate {
  if (!template || typeof template !== 'object') {
    throw new Error('Invalid template');
  }

  const t = template as GitHubLabelTemplate;

  if (!t.version) {
    throw new Error('Template missing version');
  }

  if (!Array.isArray(t.templates)) {
    throw new Error('Invalid templates structure');
  }

  for (const group of t.templates) {
    if (!group.group) {
      throw new Error('Template group missing name');
    }

    if (!Array.isArray(group.labels)) {
      throw new Error(`Invalid labels in group ${group.group}`);
    }

    for (const label of group.labels) {
      if (!label.name || !label.color) {
        throw new Error(`Invalid label in group ${group.group}`);
      }
    }
  }

  return t;
}
