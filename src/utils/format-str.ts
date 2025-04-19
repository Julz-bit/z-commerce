export function toLowerAndRemoveSpace(value?: string): string | undefined {
  return value ? value.toLowerCase().replace(/\s/g, '') : undefined;
}
