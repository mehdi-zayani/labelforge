import type { LabelConfig } from "./label.js";

export interface LabelComparison {
  toCreate: LabelConfig[];
  toUpdate: LabelConfig[];
  toDelete: LabelConfig[];
}