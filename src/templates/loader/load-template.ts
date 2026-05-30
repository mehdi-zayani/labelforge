/**
 * -------------------------
 * TEMPLATE LOADER
 * -------------------------
 * Loads and parses YAML label templates from filesystem.
 *
 * Responsibilities:
 * - resolve file path (relative or absolute)
 * - read YAML file
 * - parse content
 * - validate structure
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import type { GitHubLabelTemplate } from '../types/template.types.js';
import { validateTemplate } from '../validator/template.validator.js';

/**
 * -------------------------
 * LOAD TEMPLATE
 * -------------------------
 * Reads and validates a YAML template file.
 */
export function loadTemplate(filePath: string): GitHubLabelTemplate {
  /**
   * PATH RESOLUTION
   */
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);

  /**
   * FILE GUARD
   */
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Template not found: ${absolutePath}`);
  }

  const raw = fs.readFileSync(absolutePath, 'utf-8');

  let parsed: unknown;

  /**
   * YAML PARSING
   */
  try {
    parsed = yaml.load(raw);
  } catch {
    throw new Error(`Invalid YAML: ${absolutePath}`);
  }

  /**
   * VALIDATION PIPELINE
   */
  return validateTemplate(parsed);
}