export function parseArgs(args: string[]) {
  const command = args[0];
  const owner = args[1];
  const repo = args[2];
  const dryRun = args.includes("--dry-run");

  return {
    command,
    owner,
    repo,
    dryRun
  };
}