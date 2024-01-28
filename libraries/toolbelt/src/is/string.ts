import { getTag } from '../object/get-tag.ts';
import { isNil } from './nil.ts';

export function isString(value: unknown): value is string {
  const type = typeof value;

  return (
    type === 'string' ||
    (type === 'object' &&
      !isNil(value) &&
      !Array.isArray(value) &&
      getTag(value) === '[object String]')
  );
}
