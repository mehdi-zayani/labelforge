export function parseArgs(args: string[]) {
  const result = {
    command: undefined as string | undefined,
    owner: undefined as string | undefined,
    repo: undefined as string | undefined,
    dryRun: false,
    verbose: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "sync") result.command = "sync";
    else if (arg === "--dry-run") result.dryRun = true;
    else if (arg === "--verbose" || arg === "-v") result.verbose = true;
    else if (!result.owner) result.owner = arg;
    else if (!result.repo) result.repo = arg;
  }

  return result;
}