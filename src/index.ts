import { printSplash } from "./cli/ui/splash.js";
import { syncCommand } from "./cli/commands/sync.command.js";
import { logger } from "./utils/logger.js";
import pkg from "../package.json" with { type: "json" };

function printHelp() {
  console.log(`
Labelforge CLI

USAGE:
  labelforge <command> [options]

COMMANDS:
  sync <owner> <repo> [template]   Sync GitHub labels from a template
  login                            Authenticate with GitHub

OPTIONS:
  --dry-run                        Simulate actions without applying changes
  --help                           Show help
  --version                        Show CLI version

EXAMPLES:
  labelforge sync mehdi-zayani repo
  labelforge sync mehdi-zayani repo backend --dry-run
  labelforge login
`);
}

function printVersion() {
  console.log(`labelforge version ${pkg.version}`);
}

async function main() {
  const args = process.argv.slice(2);

  const command = args[0];

  // -------------------------
  // HELP
  // -------------------------
  if (command === "--help" || command === "help") {
    printHelp();
    return;
  }

  // -------------------------
  // VERSION
  // -------------------------
  if (command === "--version" || command === "-v") {
    printVersion();
    return;
  }

  // -------------------------
  // LOGIN
  // -------------------------
  if (command === "login") {
    const { loginCommand } = await import("./cli/commands/login.command.js");
    await loginCommand();
    return;
  }

  // -------------------------
  // SYNC
  // -------------------------
  if (command === "sync") {
    printSplash();

    const owner = args[1];
    const repo = args[2];

    if (!owner || !repo) {
      logger.error("Usage: sync owner repo [template] [--dry-run]");
      process.exit(1);
    }

    const dryRun = args.includes("--dry-run");

    if (dryRun) {
      process.env.DRY_RUN = "1";
      logger.warn("DRY-RUN MODE ON");
    }

    const filteredArgs = args.filter(
      (a) => a !== "sync" && a !== owner && a !== repo && a !== "--dry-run"
    );

    const templateInput = filteredArgs[0];

    const { resolveTemplate } = await import("./cli/utils/template-resolver.js");

    const templatePath = await resolveTemplate(templateInput);

    if (!templatePath) {
      logger.error("Template resolution failed");
      process.exit(1);
    }

    await syncCommand(owner, repo, templatePath, dryRun);
    return;
  }

  // -------------------------
  // DEFAULT
  // -------------------------
  logger.error("Unknown command. Use --help to see usage.");
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});