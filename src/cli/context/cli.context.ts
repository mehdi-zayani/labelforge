/**
 * -------------------------
 * CLI CONTEXT
 * -------------------------
 */

export type CliContext = {
  verbose: boolean;
};

/**
 * -------------------------
 * GLOBAL CLI STATE
 * -------------------------
 * In-memory runtime context shared across CLI modules.
 */
let context: CliContext = {
  verbose: false,
};

/**
 * -------------------------
 * UPDATE CLI CONTEXT
 * -------------------------
 * Merges partial runtime flags into global CLI state.
 */
export function setCliContext(newContext: Partial<CliContext>) {
  context = {
    ...context,
    ...newContext,
  };
}

/**
 * -------------------------
 * READ CLI CONTEXT
 * -------------------------
 */
export function getCliContext(): CliContext {
  return context;
}