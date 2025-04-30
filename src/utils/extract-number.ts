export function extractIndexes(fieldname: string): number[] {
  const matches = [...fieldname.matchAll(/\[(\d+)]/g)];
  return matches.map((m) => parseInt(m[1], 10));
}
