import { fetchLabels } from "./services/labels.service.js";

async function bootstrap() {
  console.log("[INFO] Fetching GitHub labels...");

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