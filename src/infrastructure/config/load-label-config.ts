import fs from "fs";
import YAML from "yaml";

import type { LabelConfig } from "../../domain/label.js";

export function loadLabelConfig(): LabelConfig[] {
  const file = fs.readFileSync("config/labels.yml", "utf8");

  const parsed = YAML.parse(file);

  return parsed.labels;
}