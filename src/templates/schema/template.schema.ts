/**
 * -------------------------
 * TEMPLATE SCHEMA
 * -------------------------
 * Defines schema version and example structure for label templates.
 *
 * Used as:
 * - reference for YAML format
 * - documentation for contributors
 * - optional validation baseline
 */

/**
 * -------------------------
 * SCHEMA VERSION
 * -------------------------
 * Current supported template format version.
 */
export const TEMPLATE_SCHEMA_VERSION = '1.0';

/**
 * -------------------------
 * TEMPLATE EXAMPLE
 * -------------------------
 * Example of a valid label template structure.
 */
export const TEMPLATE_EXAMPLE = {
  version: '1.0',
  templates: [
    {
      group: 'backend',
      labels: [
        { name: 'api', color: 'blue', description: 'API related' },
        { name: 'bug', color: 'red' },
      ],
    },
  ],
};