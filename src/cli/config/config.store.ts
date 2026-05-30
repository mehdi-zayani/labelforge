/**
 * -------------------------
 * CONFIG STORE
 * -------------------------
 */

import fs from 'fs';
import os from 'os';
import path from 'path';

import type { LabelforgeConfig } from './config.types.js';

/**
 * -------------------------
 * CONFIG PATHS
 * -------------------------
 */
const CONFIG_DIR = path.join(os.homedir(), '.labelforge');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

/**
 * -------------------------
 * DEFAULT CONFIG
 * -------------------------
 */
const DEFAULT_CONFIG: LabelforgeConfig = {
  token: null,
  defaultTemplate: null,
  defaultOwner: null,
  defaultRepo: null,
};

/**
 * -------------------------
 * CONFIG DIRECTORY SETUP
 * -------------------------
 */
function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

/**
 * -------------------------
 * READ CONFIG
 * -------------------------
 * Loads configuration from disk.
 * If missing, creates a default config file.
 */
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

/**
 * -------------------------
 * WRITE CONFIG
 * -------------------------
 */
export function writeConfig(config: LabelforgeConfig) {
  ensureConfigDir();

  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
}

/**
 * -------------------------
 * UPDATE CONFIG
 * -------------------------
 */
export function updateConfig(partial: Partial<LabelforgeConfig>) {
  const current = readConfig();

  const next = {
    ...current,
    ...partial,
  };

  writeConfig(next);
  return next;
}

/**
 * -------------------------
 * ALIASES
 * -------------------------
 */
export const loadConfig = readConfig;
export const saveConfig = writeConfig;