/**
 * -------------------------
 * LOGIN COMMAND
 * -------------------------
 */

import prompts from 'prompts';
import { saveConfig, loadConfig } from '../config/config.store.js';
import { logger } from '../../utils/logger.js';

/**
 * -------------------------
 * GITHUB AUTHENTICATION FLOW
 * -------------------------
 * Stores GitHub token locally in user config file.
 *
 * Used for:
 * - authenticated API requests
 * - future automation without re-login
 */
export async function loginCommand() {
  /**
   * -------------------------
   * LOAD EXISTING CONFIG
   * -------------------------
   */
  const existing = loadConfig();

  /**
   * -------------------------
   * TOKEN PROMPT
   * -------------------------
   */
  const response = await prompts({
    type: 'password',
    name: 'token',
    message: 'Enter your GitHub token',
  });

  /**
   * -------------------------
   * VALIDATION
   * -------------------------
   */
  if (!response.token) {
    logger.warn('No token provided');
    return;
  }

  /**
   * -------------------------
   * SAVE CONFIG
   * -------------------------
   */
  saveConfig({
    ...existing,
    token: response.token,
  });

  /**
   * -------------------------
   * SUCCESS FEEDBACK
   * -------------------------
   */
  logger.success('Token saved to ~/.labelforge/config.json');
}