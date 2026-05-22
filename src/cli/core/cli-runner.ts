export async function cliRunner(command: string, context: any) {
 switch (command) {
  case "sync":
    const { syncCommand } = await import("../commands/sync.command.js");
    return syncCommand(context.owner, context.repo, context.dryRun);

  case "apply":
    const { applyCommand } = await import("../commands/apply.command.js");
    return applyCommand(
      context.owner,
      context.repo,
      context.templatePath,
      context.dryRun
    );

  default:
    throw new Error(`Unknown command: ${command}`);
}
}