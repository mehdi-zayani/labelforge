import path from "path";
import fs from "fs";

import { readConfig } from "../config/config.store.js";

const PRESET_DIR = "src/templates/presets";

export function resolveTemplate(input?: string): string {
  const config = readConfig();

  // 1. fallback config
  if (!input && config.defaultTemplate) {
    input = config.defaultTemplate;
  }

  if (!input) {
    throw new Error("No template provided");
  }

  // 2. direct file path
  if (input.endsWith(".yml") || input.endsWith(".yaml")) {
    const abs = path.isAbsolute(input)
      ? input
      : path.resolve(process.cwd(), input);

    if (!fs.existsSync(abs)) {
      throw new Error(`Template file not found: ${abs}`);
    }

    return abs;
  }

  // 3. preset name
  const presetPath = path.resolve(
    process.cwd(),
    `${PRESET_DIR}/${input}.yml`
  );

  if (!fs.existsSync(presetPath)) {
    throw new Error(`Preset not found: ${input}`);
  }

  return presetPath;
}