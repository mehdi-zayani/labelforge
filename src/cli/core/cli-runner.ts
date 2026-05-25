import { syncCommand } from "../commands/sync.command.js";

export async function cliRunner(context: {
  owner: string;
  repo: string;
  templatePath: string;
  dryRun: boolean;
}) {
  return syncCommand(
    context.owner,
    context.repo,
    context.templatePath,
    context.dryRun
  );
}