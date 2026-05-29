import { syncCommand } from "../commands/sync.command.js";

export async function cliRunner(context: {
  owner: string;
  repo: string;
  templatePath?: string;
  dryRun: boolean;
}) {
  if (!context.owner || !context.repo) {
    throw new Error("Missing required CLI context (owner/repo)");
  }

  return syncCommand(
    context.owner,
    context.repo,
    context.templatePath ?? undefined,
    context.dryRun
  );
}