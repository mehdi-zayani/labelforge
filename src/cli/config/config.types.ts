/**
 * -------------------------
 * LABELFORGE CONFIG MODEL
 * -------------------------
 */

/**
 * -------------------------
 * CONFIG STRUCTURE
 * -------------------------
 * Defines persisted CLI configuration stored in:
 * ~/.labelforge/config.json
 *
 * Used for:
 * - authentication token storage
 * - default repository context
 * - default template selection
 */
export type LabelforgeConfig = {
  token: string | null;
  defaultTemplate: string | null;
  defaultOwner: string | null;
  defaultRepo: string | null;
};