import chalk from 'chalk';
import { isSilent } from './output-mode.js';

export function step(label: string, index: number, total: number) {
  if (isSilent()) return;
  console.log(chalk.gray(`[${index}/${total}]`) + ' ' + chalk.cyan(label));
}
