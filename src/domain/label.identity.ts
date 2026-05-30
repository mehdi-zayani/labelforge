/**
 * -------------------------
 * LABEL IDENTITY NORMALIZER
 * -------------------------
 */

/**
 * -------------------------
 * NORMALIZATION RULES
 * -------------------------
 * Converts a label name into a stable identity key:
 * - trim whitespace
 * - lowercase
 * - replace spaces with "-"
 * - replace "/" with "-"
 * - collapse multiple "-" into single "-"
 */
export function labelIdentity(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/\/+/g, '-')
    .replace(/-+/g, '-');
}