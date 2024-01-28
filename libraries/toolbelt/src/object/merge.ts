import type { MergeDeep, Simplify } from 'type-fest';

import { isEmpty } from '../is/empty.ts';
import { isNil } from '../is/nil.ts';
import { isObject } from '../is/object.ts';

type ValidObject = Record<string | symbol | number, unknown> | object;
type ValidObjectOptional = ValidObject | undefined;

type MergedItem<
  T extends ValidObject,
  U extends ValidObject,
  A extends boolean,
> = Merged<T, U, A>[Extract<keyof U, string>];

type Merged<T, U, A extends boolean> = MergeDeep<
  T,
  U,
  { arrayMergeMode: A extends true ? 'spread' : 'replace' }
>;

type RecursiveMerge<
  T extends ValidObject,
  S extends unknown[],
  A extends boolean,
> = S extends [infer U, ...infer Rest]
  ? Rest extends unknown[]
    ? RecursiveMerge<Merged<T, U, A>, Rest, A>
    : Merged<T, U, A>
  : T;

export function merge<
  T extends ValidObject,
  S extends ValidObjectOptional[],
  A extends boolean,
>(
  target: T,
  isMergingArrays: A,
  ...objects: S
): Simplify<RecursiveMerge<T, S, A>> {
  let output = target;

  for (const object of objects) {
    if (!isEmpty(object)) {
      output = mergeTwo(output, object, isMergingArrays) as T;
    }
  }

  return output as RecursiveMerge<T, S, A>;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function mergeTwo<
  T extends ValidObject,
  U extends ValidObject,
  A extends boolean,
>(target?: T, source?: U, isMergingArrays = false as A): Merged<T, U, A> {
  if (isNil(target) || isNil(source)) {
    return (target ?? source ?? {}) as Merged<T, U, A>;
  }

  const output = { ...target } as Merged<T, U, A>;

  for (const key in source) {
    if (Object.hasOwn(source, key)) {
      const targetValue = target[key as unknown as keyof T];
      const sourceValue = source[key as keyof U];

      if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
        output[key] = isMergingArrays
          ? ([...targetValue, ...sourceValue] as MergedItem<T, U, A>)
          : (sourceValue as MergedItem<T, U, A>);
      } else if (isObject(targetValue) && isObject(sourceValue)) {
        // @ts-expect-error deep/recursive typing issue, ignore this here
        output[key] = mergeTwo(
          targetValue as ValidObject,
          sourceValue as ValidObject,
          isMergingArrays,
        );
      } else {
        output[key] = sourceValue as MergedItem<T, U, A>;
      }
    }
  }

  return output;
}
