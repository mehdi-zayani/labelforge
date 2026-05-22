import type { Label } from "./label.js";

export interface LabelComparison {
  toCreate: Label[];
  toUpdate: {
    current: Label;
    next: Label;
  }[];
  toDelete: Label[];
}