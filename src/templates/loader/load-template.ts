import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import type { GitHubLabelTemplate } from '../types/template.types.js';
import { validateTemplate } from '../validator/template.validator.js';

export function loadTemplate(filePath: string): GitHubLabelTemplate {
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Template not found: ${absolutePath}`);
  }

  const raw = fs.readFileSync(absolutePath, 'utf-8');

  let parsed: unknown;

  try {
    parsed = yaml.load(raw);
  } catch {
    throw new Error(`Invalid YAML: ${absolutePath}`);
  }

  return validateTemplate(parsed);
}
