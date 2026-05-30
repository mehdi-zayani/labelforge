/**
 * -------------------------
 * TEMPLATE RESOLVER
 * -------------------------
 */

import path from 'path';
import fs from 'fs';

import { readConfig } from '../config/config.store.js';
import { selectTemplate } from '../ui/template.selector.js';
import { logger } from '../../utils/logger.js';
import { isVerbose } from '../ui/output-mode.js';

const PRESET_DIR = 'src/templates/presets';

/**
 * -------------------------
 * TEMPLATE RESOLUTION FLOW
 * -------------------------
 * Resolves template input into an absolute YAML template path.
 *
 * Resolution order:
 * 1. CLI input
 * 2. Config default template
 * 3. Interactive selector
 * 4. Direct file path (.yml/.yaml)
 * 5. Preset name lookup
 */
export async function resolveTemplate(
  input?: string
): Promise<string | undefined> {
  const config = readConfig();

  let template = input;

  /**
   * -------------------------
   * FALLBACK CONFIG
   * -------------------------
   */
  if (!template && config.defaultTemplate) {
    template = config.defaultTemplate;

    if (isVerbose()) {
      logger.debug(`[TEMPLATE] fallback config used: ${template}`);
    }
  }

  /**
   * -------------------------
   * INTERACTIVE SELECTION
   * -------------------------
   */
  if (!template) {
    logger.warn('No template provided, opening selector...');

    template = await selectTemplate();

    if (!template) {
      logger.info('Template selection cancelled');
      return undefined;
    }

    if (isVerbose()) {
      logger.debug(`[TEMPLATE] selected: ${template}`);
    }
  }

  /**
   * -------------------------
   * DIRECT FILE PATH
   * -------------------------
   */
  if (template.endsWith('.yml') || template.endsWith('.yaml')) {
    const abs = path.isAbsolute(template)
      ? template
      : path.resolve(process.cwd(), template);

    if (!fs.existsSync(abs)) {
      throw new Error(`Template file not found: ${abs}`);
    }

    if (isVerbose()) {
      logger.debug(`[TEMPLATE] file path resolved: ${abs}`);
    }

    return abs;
  }

  /**
   * -------------------------
   * PRESET NAME RESOLUTION
   * -------------------------
   */
  const presetPath = path.resolve(
    process.cwd(),
    `${PRESET_DIR}/${template}.yml`
  );

  if (!fs.existsSync(presetPath)) {
    throw new Error(`Preset not found: ${template}`);
  }

  if (isVerbose()) {
    logger.debug(`[TEMPLATE] preset resolved: ${presetPath}`);
  }

  return presetPath;
}