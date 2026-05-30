import { Octokit } from '@octokit/rest';
import { logger } from '../../utils/logger.js';
import { readConfig } from '../../cli/config/config.store.js';

let client: Octokit | null = null;

export function getOctokit(): Octokit {
  if (client) return client;

  const config = readConfig();
  const token = config.token;

  if (!token) {
    logger.error('Missing GitHub token. Please run: labelforge login');
    throw new Error('GitHub token is required');
  }

  client = new Octokit({
    auth: token,
    request: {
      timeout: 10000,
    },
  });

  logger.debug('GitHub Octokit singleton initialized');

  return client;
}
