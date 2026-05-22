import { loadPreset } from "../../templates/presets/preset.loader.js";
import type { GitHubLabel } from "../../templates/types/template.types.js";

export function loadLabelConfig(): GitHubLabel[] {
  const preset = loadPreset("backend");

  return preset.templates.flatMap((t) => t.labels);
}