/**
 * -------------------------
 * LABEL DOMAIN MODEL
 * -------------------------
 */

/**
 * -------------------------
 * LABEL ENTITY
 * -------------------------
 * Represents a GitHub label or template label.
 *
 * Used across:
 * - templates
 * - diff engine
 * - sync pipeline
 */
export type Label = {
  name: string;
  color: string;
  description: string;
};