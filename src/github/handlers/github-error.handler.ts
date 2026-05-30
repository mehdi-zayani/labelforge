import { logger } from '../../utils/logger.js';

export function handleGitHubError(error: any, context: string) {
  const status = error?.status;

  if (status === 404) {
    logger.warn(`[SKIP] already deleted: ${context}`);
    return;
  }

  logger.error(`GitHub API error in ${context}`);

  if (status === 401) {
    logger.error('Unauthorized (401) - check GitHub token');
  } else if (status === 403) {
    logger.error('Forbidden (403) - missing permissions');
  } else if (status >= 500) {
    logger.error('GitHub server error (5xx)');
  } else {
    logger.error('Unexpected GitHub error');
    logger.debug(JSON.stringify(error, null, 2));
  }
}
