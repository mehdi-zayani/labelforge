/**
 * -------------------------
 * TEMPLATE VALIDATOR
 * -------------------------
 * Performs runtime validation of a GitHub label template structure.
 *
 * Ensures:
 * - template shape is valid
 * - version exists
 * - groups are well-formed
 * - labels contain required fields
 */

import type { GitHubLabelTemplate } from '../types/template.types.js';

/**
 * -------------------------
 * VALIDATE TEMPLATE
 * -------------------------
 * Runtime safety check for parsed YAML templates.
 */
export function validateTemplate(template: unknown): GitHubLabelTemplate {
  /**
   * BASE CHECK
   */
  if (!template || typeof template !== 'object') {
    throw new Error('Invalid template');
  }

  const t = template as GitHubLabelTemplate;

  /**
   * VERSION CHECK
   */
  if (!t.version) {
    throw new Error('Template missing version');
  }

  /**
   * STRUCTURE CHECK
   */
  if (!Array.isArray(t.templates)) {
    throw new Error('Invalid templates structure');
  }

  /**
   * GROUP + LABEL VALIDATION
   */
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