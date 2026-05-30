/**
 * -------------------------
 * SYNC POLICY MODEL
 * -------------------------
 */

/**
 * -------------------------
 * SYNC STRATEGY
 * -------------------------
 * Defines how label synchronization behaves.
 *
 * RESET:
 * - deletes all remote labels
 * - recreates labels from template
 */
export type SyncPolicy = 'RESET';

/**
 * -------------------------
 * DEFAULT POLICY
 * -------------------------
 */
export const syncPolicy: SyncPolicy = 'RESET';