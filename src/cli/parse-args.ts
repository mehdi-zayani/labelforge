/**
 * -------------------------
 * CLI ARGUMENT PARSER
 * -------------------------
 */

/**
 * -------------------------
 * ARGUMENT PARSING RULES
 * -------------------------
 * Converts raw CLI arguments into a structured execution context.
 *
 * Supports:
 * - command detection (sync / apply)
 * - positional args (owner / repo / templatePath)
 * - flags (--dry-run, --verbose)
 */
export function parseArgs(args: string[]) {
  /**
   * -------------------------
   * DEFAULT RESULT SHAPE
   * -------------------------
   */
  const result = {
    command: undefined as string | undefined,
    owner: undefined as string | undefined,
    repo: undefined as string | undefined,
    templatePath: undefined as string | undefined,
    dryRun: args.includes('--dry-run') || args.includes('-d'),
    verbose: false,
  };

  /**
   * -------------------------
   * ARGUMENT ITERATION
   * -------------------------
   */
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === 'sync' || arg === 'apply') result.command = arg;
    else if (arg === '--dry-run') result.dryRun = true;
    else if (arg === '--verbose' || arg === '-v') result.verbose = true;
    else if (!result.owner) result.owner = arg;
    else if (!result.repo) result.repo = arg;
    else if (!result.templatePath) result.templatePath = arg;
  }

  return result;
}