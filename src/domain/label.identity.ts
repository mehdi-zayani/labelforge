export function labelIdentity(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/\/+/g, "-")
    .replace(/-+/g, "-");
}