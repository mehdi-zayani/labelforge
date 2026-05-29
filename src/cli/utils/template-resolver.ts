import path from "path";
import fs from "fs";

import { readConfig } from "../config/config.store.js";
import { selectTemplate } from "../ui/template.selector.js";
import { logger } from "../../utils/logger.js";

const PRESET_DIR = "src/templates/presets";

export async function resolveTemplate(
  input?: string
): Promise<string | undefined> {
  const config = readConfig();

  let template = input;

  // 1. fallback config
  if (!template && config.defaultTemplate) {
    template = config.defaultTemplate;
  }

  // 2. interactive selector
  if (!template) {
    logger.warn("No template provided, opening selector...");

    template = await selectTemplate();

    if (!template) {
      logger.info("Template selection cancelled");
      return undefined;
    }
  }

  // 3. direct file path (.yml / .yaml)
  if (template.endsWith(".yml") || template.endsWith(".yaml")) {
    const abs = path.isAbsolute(template)
      ? template
      : path.resolve(process.cwd(), template);

    if (!fs.existsSync(abs)) {
      throw new Error(`Template file not found: ${abs}`);
    }

    return abs;
  }

  // 4. preset name
  const presetPath = path.resolve(
    process.cwd(),
    `${PRESET_DIR}/${template}.yml`
  );

  if (!fs.existsSync(presetPath)) {
    throw new Error(`Preset not found: ${template}`);
  }

  return presetPath;
}