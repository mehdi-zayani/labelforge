import type { Label } from './label.js';

export type GitHubLabel = {
  name: string;
  color: string;
  description: string;
};

/**
 * -------------------------
 * DIFF RESULT STRUCTURE
 * -------------------------
 */
export type LabelComparison = {
  toCreate: Label[];
  toUpdate: { current: GitHubLabel; next: Label }[];
  toDelete: GitHubLabel[];
  toIgnore: Label[];
};