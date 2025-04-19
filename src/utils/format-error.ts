import { ValidationError } from 'class-validator';

export function formatErrors(
  errors: ValidationError[],
  parentKey = '',
): Record<string, string>[] {
  const result: Record<string, string>[] = [];

  for (const error of errors) {
    // If the property is missing, it's an array index level
    const key = error.property
      ? parentKey
        ? `${parentKey}.${error.property}`
        : error.property
      : parentKey;

    if (error.constraints) {
      result.push({ [key]: Object.values(error.constraints).join(', ') });
    }

    if (error.children && error.children.length > 0) {
      error.children.forEach((child, index) => {
        if (!child.property) {
          const indexedKey = `${key}[${index}]`;
          result.push(...formatErrors([child], indexedKey));
        } else {
          result.push(...formatErrors([child], key));
        }
      });
    }
  }

  return result;
}
