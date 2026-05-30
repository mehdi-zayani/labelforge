import { printSplash } from './cli/ui/splash.js';
import { syncCommand } from './cli/commands/sync.command.js';
import { logger } from './utils/logger.js';
import pkg from '../package.json' with { type: 'json' };

function printHelp() {
  console.log(`
Labelforge CLI

USAGE:
  labelforge <command> [options]

COMMANDS:
  sync <owner> <repo> [template]   Sync GitHub labels from a template
  login                            Authenticate with GitHub
  help                             Show help

OPTIONS:
  --dry-run                        Simulate actions without applying changes
  --json                           Output machine-readable result only
  --silent                         No UI output (CI mode)
  --verbose                        Detailed logs
  --help                           Show help
  --version                        Show CLI version

EXAMPLES:
  labelforge sync mehdi-zayani repo
  labelforge sync mehdi-zayani repo backend --dry-run
  labelforge sync mehdi-zayani repo --json backend
  labelforge login
`);
}

function printVersion() {
  console.log(`labelforge version ${pkg.version}`);
}

async function main() {
  const args = process.argv.slice(2);

  // -------------------------
  // FLAGS (GLOBAL)
  // -------------------------
  const isJson = args.includes('--json');
  const isSilent = args.includes('--silent');
  const isVerbose = args.includes('--verbose');
  const isDryRun = args.includes('--dry-run');

  process.env.JSON_MODE = isJson ? '1' : '0';
  process.env.SILENT = isSilent ? '1' : '0';
  process.env.VERBOSE = isVerbose ? '1' : '0';
  process.env.DRY_RUN = isDryRun ? '1' : '0';

  // remove flags from args
  const cleanArgs = args.filter((a) => !a.startsWith('--'));
  const command = cleanArgs[0];

  // -------------------------
  // HELP
  // -------------------------
  if (command === 'help' || args.includes('--help')) {
    printHelp();
    return;
  }

  // -------------------------
  // VERSION
  // -------------------------
  if (
    command === 'version' ||
    args.includes('--version') ||
    args.includes('-v')
  ) {
    printVersion();
    return;
  }

  // -------------------------
  // LOGIN
  // -------------------------
  if (command === 'login') {
    const { loginCommand } = await import('./cli/commands/login.command.js');
    await loginCommand();
    return;
  }

  // -------------------------
  // SYNC
  // -------------------------
  if (command === 'sync') {
    printSplash();

    const owner = cleanArgs[1];
    const repo = cleanArgs[2];
    const templateInput = cleanArgs[3];

    if (!owner || !repo) {
      logger.error('Usage: sync owner repo [template] [--dry-run]');
      process.exit(1);
    }

    const { resolveTemplate } =
      await import('./cli/utils/template-resolver.js');

    const templatePath = await resolveTemplate(templateInput);

    if (!templatePath) {
      logger.error('Template resolution failed');
      process.exit(1);
    }

    await syncCommand(owner, repo, templatePath, isDryRun);
    return;
  }

  logger.error('Unknown command. Use --help');
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
