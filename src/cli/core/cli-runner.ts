export async function cliRunner(command: string, context: any) {
  switch (command) {
    case "sync":
      const { syncCommand } = await import("../commands/sync.command.js");
      return syncCommand(context.owner, context.repo, context.dryRun);

    default:
      throw new Error(`Unknown command: ${command}`);
  }
}