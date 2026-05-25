import path from "path";
import fs from "fs";

export function resolveTemplate(input: string): string {
  const isFile = input.endsWith(".yml") || input.endsWith(".yaml");

  if (isFile) {
    const absolute = path.isAbsolute(input)
      ? input
      : path.resolve(process.cwd(), input);

    if (!fs.existsSync(absolute)) {
      throw new Error(`Template file not found: ${absolute}`);
    }

    return absolute;
  }

  // preset mode
  return path.resolve(process.cwd(), "src/templates/presets", `${input}.yml`);
}