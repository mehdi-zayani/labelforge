/**
 * -------------------------
 * PRESET LOADER
 * -------------------------
 * Loads built-in YAML templates (presets) from local filesystem.
 *
 * Used for:
 * - frontend preset
 * - backend preset
 * - devops preset
 * - infra preset
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import type { GitHubLabelTemplate } from '../types/template.types.js';

/**
 * -------------------------
 * LOAD PRESET
 * -------------------------
 * Reads a preset YAML file and returns parsed template.
 */
export function loadPreset(name: string): GitHubLabelTemplate {
  /**
   * PRESET PATH RESOLUTION
   */
  const filePath = path.resolve(
    process.cwd(),
    'src/templates/presets',
    `${name}.yml`
  );

  /**
   * FILE GUARD
   */
  if (!fs.existsSync(filePath)) {
    throw new Error(`Preset not found: ${name}`);
  }

  const file = fs.readFileSync(filePath, 'utf-8');

  /**
   * YAML PARSING
   */
  return yaml.load(file) as GitHubLabelTemplate;
}