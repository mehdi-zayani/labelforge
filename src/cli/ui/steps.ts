import chalk from "chalk";

export function step(label: string, index: number, total: number) {
  console.log(
    chalk.gray(`[${index}/${total}]`) +
      " " +
      chalk.cyan(label)
  );
}