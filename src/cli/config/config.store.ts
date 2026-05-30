import fs from 'fs';
import os from 'os';
import path from 'path';

import type { LabelforgeConfig } from './config.types.js';

const CONFIG_DIR = path.join(os.homedir(), '.labelforge');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

const DEFAULT_CONFIG: LabelforgeConfig = {
  token: null,
  defaultTemplate: null,
  defaultOwner: null,
  defaultRepo: null,
};

function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

export function readConfig(): LabelforgeConfig {
  ensureConfigDir();

  if (!fs.existsSync(CONFIG_FILE)) {
    writeConfig(DEFAULT_CONFIG);
    return DEFAULT_CONFIG;
  }

  try {
    const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');

    return {
      ...DEFAULT_CONFIG,
      ...JSON.parse(raw),
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function writeConfig(config: LabelforgeConfig) {
  ensureConfigDir();

  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
}

export function updateConfig(partial: Partial<LabelforgeConfig>) {
  const current = readConfig();

  const next = {
    ...current,
    ...partial,
  };

  writeConfig(next);
  return next;
}

export const loadConfig = readConfig;
export const saveConfig = writeConfig;
