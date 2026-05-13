export type CliContext = {
  verbose: boolean;
};

let context: CliContext = {
  verbose: false,
};

export function setCliContext(newContext: Partial<CliContext>) {
  context = {
    ...context,
    ...newContext,
  };
}

export function getCliContext(): CliContext {
  return context;
}