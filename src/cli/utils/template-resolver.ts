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

<<<<<<< Updated upstream
  if (!input) {
    throw new Error("No template provided");
  }

  // 2. direct file path
=======
  // 2. interactive selector
  if (!input) {
    console.log("[INFO] No template provided, opening selector...");

    input = await selectTemplate();

    if (!input) {
      console.log("[INFO] Template selection cancelled");
      process.exit(0);
    }
  }

  // 3. direct file path
>>>>>>> Stashed changes
  if (input.endsWith(".yml") || input.endsWith(".yaml")) {
    const abs = path.isAbsolute(input)
      ? input
      : path.resolve(process.cwd(), input);

    if (!fs.existsSync(abs)) {
      throw new Error(`Template file not found: ${abs}`);
    }

    return abs;
  }

<<<<<<< Updated upstream
  // 3. preset name
=======
  // 4. preset name
>>>>>>> Stashed changes
  const presetPath = path.resolve(
    process.cwd(),
    `${PRESET_DIR}/${input}.yml`
  );

  if (!fs.existsSync(presetPath)) {
    throw new Error(`Preset not found: ${input}`);
  }

  return presetPath;
}