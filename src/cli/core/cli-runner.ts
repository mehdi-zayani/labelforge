/**
 * -------------------------
 * CLI RUNNER
 * -------------------------
 */

import { syncCommand } from '../commands/sync.command.js';

/**
 * -------------------------
 * CLI CONTEXT EXECUTION
 * -------------------------
 * Central entrypoint to execute CLI command flow (sync).
 *
 * This layer isolates command execution from argument parsing,
 * making the CLI easier to test and extend later.
 */
export async function cliRunner(context: {
  owner: string;
  repo: string;
  templatePath?: string;
  dryRun: boolean;
}) {
  /**
   * -------------------------
   * VALIDATION
   * -------------------------
   */
  if (!context.owner || !context.repo) {
    throw new Error('Missing required CLI context (owner/repo)');
  }

  /**
   * -------------------------
   * COMMAND DELEGATION
   * -------------------------
   */
  return syncCommand(
    context.owner,
    context.repo,
    context.templatePath ?? undefined,
    context.dryRun
  );
}