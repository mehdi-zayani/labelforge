import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

type GitHubLabel = {
  name: string;
  color: string;
  description: string | null;
};

/**
 * -------------------------
 * TEMPLATE FILE STRUCTURE
 * -------------------------
 */
type TemplateFile = {
  version: string;
  templates: {
    group: string;
    labels: GitHubLabel[];
  }[];
};

/**
 * -------------------------
 * LOAD LABEL CONFIG
 * -------------------------
 */
export function loadLabelConfig(templatePath: string): GitHubLabel[] {
  const absolutePath = path.isAbsolute(templatePath)
    ? templatePath
    : path.resolve(process.cwd(), templatePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Template not found: ${absolutePath}`);
  }

  const raw = fs.readFileSync(absolutePath, 'utf-8');
  const parsed = yaml.load(raw) as TemplateFile;

  if (!parsed?.templates) {
    throw new Error('Invalid template structure');
  }

  return parsed.templates.flatMap((group) => group.labels);
}