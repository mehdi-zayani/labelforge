/**
 * -------------------------
 * GITHUB OCTOKIT CLIENT
 * -------------------------
 */

import { Octokit } from '@octokit/rest';
import { logger } from '../../utils/logger.js';
import { readConfig } from '../../cli/config/config.store.js';

/**
 * -------------------------
 * SINGLETON CLIENT
 * -------------------------
 */
let client: Octokit | null = null;

/**
 * -------------------------
 * OCTOKIT FACTORY
 * -------------------------
 * Creates a singleton GitHub API client.
 *
 * Token is loaded from user config (~/.labelforge/config.json).
 */
export function getOctokit(): Octokit {
  /**
   * -------------------------
   * RETURN EXISTING CLIENT
   * -------------------------
   */
  if (client) return client;

  /**
   * -------------------------
   * LOAD USER CONFIG
   * -------------------------
   */
  const config = readConfig();
  const token = config.token;

  /**
   * -------------------------
   * VALIDATION
   * -------------------------
   */
  if (!token) {
    logger.error('Missing GitHub token. Please run: labelforge login');
    throw new Error('GitHub token is required');
  }

  /**
   * -------------------------
   * CLIENT INITIALIZATION
   * -------------------------
   */
  client = new Octokit({
    auth: token,
    request: {
      timeout: 10000,
    },
  });

  /**
   * -------------------------
   * DEBUG TRACE
   * -------------------------
   */
  logger.debug('GitHub Octokit singleton initialized');

  return client;
}