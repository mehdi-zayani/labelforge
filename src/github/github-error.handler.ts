export function handleGitHubError(error: any, context: string) {
  const status = error?.status;

  console.error(`[GITHUB ERROR] Context: ${context}`);

  if (status === 404) {
    console.error("[ERROR] Resource not found (404)");
  } else if (status === 401) {
    console.error("[ERROR] Unauthorized (401) - check GitHub token");
  } else if (status === 403) {
    console.error("[ERROR] Forbidden (403) - missing permissions");
  } else if (status >= 500) {
    console.error("[ERROR] GitHub server error (5xx)");
  } else {
    console.error("[ERROR] Unexpected GitHub error:", error);
  }
}