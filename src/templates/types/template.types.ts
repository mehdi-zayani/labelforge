/**
 * -------------------------
 * GITHUB LABEL TYPES
 * -------------------------
 * Core type definitions for GitHub label system and templates.
 *
 * Used across:
 * - template parser
 * - template validator
 * - sync pipeline
 * - GitHub API layer
 */

/**
 * -------------------------
 * GITHUB LABEL
 * -------------------------
 * Represents a single GitHub label entity.
 */
export type GitHubLabel = {
  name: string;
  color: string;
  description?: string;
};

/**
 * -------------------------
 * TEMPLATE GROUP
 * -------------------------
 * Group of labels under a logical category (e.g. backend, frontend).
 */
export type GitHubTemplateGroup = {
  group: string;
  labels: GitHubLabel[];
};

/**
 * -------------------------
 * TEMPLATE ROOT
 * -------------------------
 * Full template structure containing version + grouped labels.
 */
export type GitHubLabelTemplate = {
  version: string;
  templates: GitHubTemplateGroup[];
};