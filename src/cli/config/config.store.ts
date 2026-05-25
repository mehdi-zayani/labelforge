import fs from "fs";
import path from "path";

const CONFIG_PATH = path.join(process.env.HOME || "", ".labelforge", "config.json");

export type LabelforgeConfig = {
  githubToken?: string;
  defaultTemplate?: string;
  defaultOwner?: string;
};

export function loadConfig(): LabelforgeConfig {
  if (!fs.existsSync(CONFIG_PATH)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
}

export function saveConfig(config: LabelforgeConfig) {
  const dir = path.dirname(CONFIG_PATH);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}