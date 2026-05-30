export function isDebug(): boolean {
  return process.env.DEBUG === '1';
}
