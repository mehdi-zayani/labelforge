import { fetchLabels } from "./services/labels.service.js";
import { loadLabelConfig } from "./loaders/load-label-config.js";
import { compareLabels } from "./services/label-compare.service.js";
import { syncLabels } from "./services/sync.service.js";

async function bootstrap() {
  console.log("[INFO] Fetching GitHub labels...");

  try {
    const localLabels = loadLabelConfig();

    console.log(`[SUCCESS] Loaded ${localLabels.length} local labels`);

    const remoteLabels = await fetchLabels(
      "mehdi-zayani",
      "testing-repo"
    );

    console.log(`[SUCCESS] Fetched ${remoteLabels.length} remote labels`);

    const diff = compareLabels(localLabels, remoteLabels);

    console.log("[COMPARE RESULT]", {
      create: diff.toCreate.length,
      update: diff.toUpdate.length,
      delete: diff.toDelete.length
    });

    await syncLabels("mehdi-zayani", "testing-repo", diff);

    console.log("[SUCCESS] GitHub labels synchronized");

  } catch (error) {
    console.error("[ERROR] Failed to process labels", error);
  }
}

bootstrap();