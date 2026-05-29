import ora from "ora";
import chalk from "chalk";

const isDebug = process.env.DEBUG === "1";

export async function runAction<T>(
  label: string,
  fn: () => Promise<T>
): Promise<T> {
  const spinner = ora(label).start();

  try {
    const result = await fn();
    spinner.succeed(chalk.green(label));
    return result;
  } catch (err) {
    spinner.fail(chalk.red(label));
    throw err;
  }
}

export function debugLog(...args: any[]) {
  if (isDebug) {
    console.log("[DEBUG]", ...args);
  }
}