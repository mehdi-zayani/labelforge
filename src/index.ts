import { fetchLabels } from "./services/labels.service.js";
import { loadLabelConfig } from "./loaders/load-label-config.js";
import { compareLabels } from "./services/label-compare.service.js";

async function bootstrap() {
  console.log("[INFO] Fetching GitHub labels...");

  try {
    // Load local config
    const localLabels = loadLabelConfig();

    console.log(
      `[SUCCESS] Loaded ${localLabels.length} local labels`
    );

    // Fetch remote labels
    const remoteLabels = await fetchLabels(
      "mehdi-zayani",
      "testing-repo"
    );

    console.log(
      `[SUCCESS] Fetched ${remoteLabels.length} remote labels`
    );

    // 3️⃣ Compare
    const diff = compareLabels(localLabels, remoteLabels);

    console.log("[COMPARE RESULT]");
    console.log("To create:", diff.toCreate.length);
    console.log("To update:", diff.toUpdate.length);
    console.log("To delete:", diff.toDelete.length);

    // Optionnel debug détaillé
    console.log(diff);

  } catch (error) {
    console.error("[ERROR] Failed to process labels", error);
  }
}

bootstrap();