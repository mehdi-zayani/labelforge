import chalk from "chalk";
import { getCliContext } from "../cli/context/cli.context.js";
import { isDebug } from "./debug.js";

function isVerbose() {
  return getCliContext().verbose;
}

export const logger = {
  info: (msg: string) => {
    console.log(chalk.blue(`[INFO] ${msg}`));
  },

  success: (msg: string) => {
    console.log(chalk.green(`[SUCCESS] ${msg}`));
  },

  warn: (msg: string) => {
    console.log(chalk.yellow(`[WARN] ${msg}`));
  },

  error: (msg: string) => {
    console.log(chalk.red(`[ERROR] ${msg}`));
  },

  debug: (msg: string) => {
    if (isVerbose() || isDebug()) {
      console.log(chalk.gray(`[DEBUG] ${msg}`));
    }
  },
};