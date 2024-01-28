import { isNil } from './nil.ts';

export function isEmpty<T>(value: T): boolean {
  if (isNil(value)) {
    return true;
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'object') {
    if (value instanceof Map || value instanceof Set) {
      return value.size === 0;
    }

    if (value instanceof Buffer) {
      return value.length === 0;
    }

    return Object.keys(value as object).length === 0;
  }

  return false;
}
