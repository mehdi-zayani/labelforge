import type { Label } from "./label.js";
import type { GitHubLabel } from "../github/api/labels.api.js";

export type LabelComparison = {
  toCreate: Label[];
  toUpdate: { current: GitHubLabel; next: Label }[];
  toDelete: GitHubLabel[];
  toIgnore: Label[];
};