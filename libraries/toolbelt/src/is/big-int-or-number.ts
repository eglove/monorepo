export function isBigIntOrNumber(value: unknown): boolean {
  if (
    (typeof value === 'number' || typeof value === 'bigint') &&
    !Number.isNaN(value)
  ) {
    return true;
  }

  if (typeof value === 'string') {
    return /^-?\d+$/.test(value);
  }

  return false;
}
