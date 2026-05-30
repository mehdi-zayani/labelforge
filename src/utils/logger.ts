import chalk from "chalk";
import { isDebug } from "./debug.js";

function isVerbose(): boolean {
  return process.env.VERBOSE === "1";
}

function isSilent(): boolean {
  return process.env.SILENT === "1";
}

export const logger = {
  info: (msg: string) => {
    if (isSilent()) return;
    console.log(chalk.blue(`[INFO] ${msg}`));
  },

  success: (msg: string) => {
    if (isSilent()) return;
    console.log(chalk.green(`[SUCCESS] ${msg}`));
  },

  warn: (msg: string) => {
    if (isSilent()) return;
    console.log(chalk.yellow(`[WARN] ${msg}`));
  },

  error: (msg: string) => {
    console.log(chalk.red(`[ERROR] ${msg}`));
  },

  debug: (msg: string) => {
    if (isSilent()) return;

    if (isVerbose() || isDebug()) {
      console.log(chalk.gray(`[DEBUG] ${msg}`));
    }
  },
};