export type OutputMode = "normal" | "json" | "silent" | "verbose";

export function getOutputMode(): OutputMode {
  if (process.env.JSON_MODE === "1") return "json";
  if (process.env.SILENT === "1") return "silent";
  if (process.env.VERBOSE === "1") return "verbose";
  return "normal";
}

export function isJson() {
  return getOutputMode() === "json";
}

export function isSilent() {
  return getOutputMode() === "silent";
}

export function isVerbose() {
  return getOutputMode() === "verbose";
}