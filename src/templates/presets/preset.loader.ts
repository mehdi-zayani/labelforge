import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import type { GitHubLabelTemplate } from '../types/template.types.js';

export function loadPreset(name: string): GitHubLabelTemplate {
  const filePath = path.resolve(
    process.cwd(),
    'src/templates/presets',
    `${name}.yml`
  );

  if (!fs.existsSync(filePath)) {
    throw new Error(`Preset not found: ${name}`);
  }

  const file = fs.readFileSync(filePath, 'utf-8');
  return yaml.load(file) as GitHubLabelTemplate;
}
