import type { MergeDeep } from 'type-fest';

import { isEmpty } from '../is/empty.js';
import { isNil } from '../is/nil.ts';
import { isObject } from '../is/object.js';

type ValidObject = Record<string | symbol | number, unknown> | object;
type ValidObjectOptional = ValidObject | undefined;

type MergedItem<T extends ValidObject, U extends ValidObject> = Merged<
  T,
  U
>[Extract<keyof U, string>];

type Merged<T, U> = MergeDeep<T, U, { arrayMergeMode: 'spread' }>;

export function merge<T extends ValidObject, U extends ValidObjectOptional>(
  target: T,
  source: U,
): Merged<T, U>;
export function merge<
  T extends ValidObject,
  U extends ValidObjectOptional,
  V extends ValidObjectOptional,
>(target: T, sourceOne: U, sourceTwo: V): Merged<Merged<T, U>, V>;
export function merge<
  T extends ValidObject,
  U extends ValidObjectOptional,
  V extends ValidObjectOptional,
  W extends ValidObjectOptional,
>(
  target: T,
  sourceOne: U,
  sourceTwo: V,
  sourceThree: W,
): Merged<Merged<Merged<T, U>, V>, W>;

export function merge(
  target: ValidObject,
  ...objects: Array<ValidObject | undefined>
) {
  let output = target;

  for (const object of objects) {
    if (!isEmpty(object)) {
      output = mergeTwo(output, object);
    }
  }

  return output;
}

function mergeTwo<T extends ValidObject, U extends ValidObject>(
  target?: T,
  source?: U,
): Merged<T, U> {
  if (isNil(target) || isNil(source)) {
    return (target ?? source ?? {}) as Merged<T, U>;
  }

  const output = { ...target } as Merged<T, U>;

  for (const key in source) {
    const targetValue = target[key as unknown as keyof T];
    const sourceValue = source[key as keyof U];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      output[key] = [...targetValue, ...sourceValue] as MergedItem<T, U>;
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      output[key] = mergeTwo(
        targetValue as ValidObject,
        sourceValue as ValidObject,
      ) as MergedItem<T, U>;
    } else {
      output[key] = sourceValue as MergedItem<T, U>;
    }
  }

  return output;
}
