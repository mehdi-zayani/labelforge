/**
 * -------------------------
 * TEMPLATE SELECTOR (CLI UI)
 * -------------------------
 */

import prompts from 'prompts';
import { readConfig } from '../config/config.store.js';
import { logger } from '../../utils/logger.js';

/**
 * -------------------------
 * AVAILABLE TEMPLATES
 * -------------------------
 * Static list of selectable label presets.
 */
const TEMPLATES = [
  { title: 'Backend', value: 'backend' },
  { title: 'Frontend', value: 'frontend' },
  { title: 'DevOps', value: 'devops' },
  { title: 'Infra', value: 'infra' },
];

/**
 * -------------------------
 * TEMPLATE INTERACTIVE SELECTION
 * -------------------------
 * Prompts user to select a label template when none is provided.
 *
 * Behavior:
 * - Uses default template from config if available
 * - Falls back to first option otherwise
 * - Handles cancellation gracefully
 */
export async function selectTemplate(): Promise<string | undefined> {
  const config = readConfig();

  const defaultIndex = config.defaultTemplate
    ? TEMPLATES.findIndex((t) => t.value === config.defaultTemplate)
    : 0;

  const response = await prompts(
    {
      type: 'select',
      name: 'template',
      message: 'Select a label template',
      choices: TEMPLATES,
      initial: defaultIndex >= 0 ? defaultIndex : 0,
    },
    {
      onCancel: () => {
        logger.info('Template selection cancelled');
        return true;
      },
    }
  );

  if (!response.template) {
    return undefined;
  }

  return response.template;
}