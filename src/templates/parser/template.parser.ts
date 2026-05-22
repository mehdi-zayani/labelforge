import fs from "fs";
import yaml from "js-yaml";
import type { GitHubLabelTemplate } from "../types/template.types.js";

export function parseTemplate(filePath: string): GitHubLabelTemplate {
  const file = fs.readFileSync(filePath, "utf-8");

  return yaml.load(file) as GitHubLabelTemplate;
}