export function getBackoffDelay(
  attempt: number,
  baseDelay = 500,
  maxDelay = 10_000
): number {
  const exponential = baseDelay * 2 ** attempt;
  return Math.min(exponential, maxDelay);
}