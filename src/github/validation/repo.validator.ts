import { getOctokit } from "../client/github.client.js";
import { logger } from "../../utils/logger.js";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function retry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 300
): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    const status = err?.status;

    logger.warn(
      `[GitHub] validate repo failed (status=${status ?? "unknown"})`
    );

    if (retries <= 0) throw err;

    await sleep(delay);
    return retry(fn, retries - 1, delay * 1.5);
  }
}

export async function validateRepositoryAccess(
  owner: string,
  repo: string
): Promise<boolean> {
  try {
    await retry(() =>
      getOctokit().rest.repos.get({
        owner,
        repo,
      })
    );

    return true;
  } catch (err: any) {
   logger.error(
  `[GitHub] Repository validation failed | status=${err?.status} | message=${err?.message}`
);
    return false;
  }
}