import chalk from "chalk";
import figlet from "figlet";
import pkg from "../../../package.json" with { type: "json" };

export function printSplash() {
  const title = figlet.textSync("Labelforge", {
    horizontalLayout: "default",
  });

  console.log(chalk.cyan(title));

  console.log(chalk.gray("────────────────────────────"));

  console.log(
    chalk.white("version : ") + chalk.green(pkg.version)
  );

  console.log(
    chalk.white("author  : ") + chalk.yellow("Mehdi Zayani")
  );

  console.log(chalk.gray("────────────────────────────\n"));
}