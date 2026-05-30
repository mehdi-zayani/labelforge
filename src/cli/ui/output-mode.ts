/**
 * -------------------------
 * OUTPUT MODE
 * -------------------------
 */

export type OutputMode = 'normal' | 'json' | 'silent' | 'verbose';

/**
 * -------------------------
 * OUTPUT MODE RESOLUTION
 * -------------------------
 * Determines CLI output behavior based on environment flags.
 *
 * Priority:
 * 1. JSON mode
 * 2. Silent mode
 * 3. Verbose mode
 * 4. Normal mode (default)
 */
export function getOutputMode(): OutputMode {
  if (process.env.JSON_MODE === '1') return 'json';
  if (process.env.SILENT === '1') return 'silent';
  if (process.env.VERBOSE === '1') return 'verbose';
  return 'normal';
}

/**
 * -------------------------
 * JSON MODE
 * -------------------------
 */
export function isJson() {
  return getOutputMode() === 'json';
}

/**
 * -------------------------
 * SILENT MODE
 * -------------------------
 */
export function isSilent() {
  return getOutputMode() === 'silent';
}

/**
 * -------------------------
 * VERBOSE MODE
 * -------------------------
 */
export function isVerbose() {
  return getOutputMode() === 'verbose';
}