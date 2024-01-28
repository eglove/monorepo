export function getTag<T>(value: T) {
  if (value === undefined) {
    return '[object Undefined]';
  }

  if (value === null) {
    return '[object Null]';
  }

  return Object.prototype.toString.call(value);
}
