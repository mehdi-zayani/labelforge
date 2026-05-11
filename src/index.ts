import { fetchLabels } from "./services/labels.service.js";
import { loadLabelConfig } from "./loaders/load-label-config.js";

async function bootstrap() {
  console.log("[INFO] Fetching GitHub labels...");
const localLabels = loadLabelConfig();

console.log("[INFO] Local labels loaded:");
console.log(`[SUCCESS] Loaded ${localLabels.length} local labels`);
  try {
    const labels = await fetchLabels("mehdi-zayani", "testing-repo");

    console.log("[SUCCESS] Labels fetched:");
    for (const label of labels) {
      console.log(`- ${label.name} (${label.color})`);
    }
  } catch (error) {
    console.error("[ERROR] Failed to fetch labels", error);
  }
}

bootstrap();