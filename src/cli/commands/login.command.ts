import prompts from 'prompts';
import { saveConfig, loadConfig } from '../config/config.store.js';
import { logger } from '../../utils/logger.js';

export async function loginCommand() {
  const existing = loadConfig();

  const response = await prompts({
    type: 'password',
    name: 'token',
    message: 'Enter your GitHub token',
  });

  if (!response.token) {
    logger.warn('No token provided');
    return;
  }

  saveConfig({
    ...existing,
    token: response.token,
  });

  logger.success('Token saved to ~/.labelforge/config.json');
}
