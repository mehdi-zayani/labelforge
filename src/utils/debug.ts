/**
 * -------------------------
 * DEBUG UTIL
 * -------------------------
 */

/**
 * -------------------------
 * DEBUG MODE CHECK
 * -------------------------
 * Returns true when DEBUG mode is enabled via environment variable.
 *
 * Used to activate low-level logging (timings, retries, HTTP calls).
 */
export function isDebug(): boolean {
  return process.env.DEBUG === '1';
}