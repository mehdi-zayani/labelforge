import { loadLabelConfig } from "./loaders/load-label-config.js";
import { runSyncPipeline } from "./application/sync.pipeline.usecase.js";

async function bootstrap() {
  console.log("[INFO] Fetching GitHub labels...");

  try {
    const localLabels = loadLabelConfig();

    console.log(`[SUCCESS] Loaded ${localLabels.length} local labels`);

    const diff = await runSyncPipeline(
      "mehdi-zayani",
      "testing-repo",
      false
    );

    console.log("[COMPARE RESULT]", {
      create: diff.toCreate.length,
      update: diff.toUpdate.length,
      delete: diff.toDelete.length
    });

    console.log("[SUCCESS] GitHub labels synchronized");

  } catch (error) {
    console.error("[ERROR] Failed to process labels", error);
  }
}

bootstrap();