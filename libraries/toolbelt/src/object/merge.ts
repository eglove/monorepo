import type { MergeDeep, Simplify } from 'type-fest';

import { isEmpty } from '../is/empty.ts';
import { isNil } from '../is/nil.ts';
import { isObject } from '../is/object.ts';

type ValidObject = Record<string | symbol | number, unknown> | object;
type ValidObjectOptional = ValidObject | undefined;

type MergedItem<
  Target extends ValidObject,
  Source extends ValidObject,
  ArrayMerge extends boolean,
> = Merged<Target, Source, ArrayMerge>[Extract<keyof Source, string>];

type Merged<Target, Source, ArrayMerge extends boolean> = MergeDeep<
  Target,
  Source,
  { arrayMergeMode: ArrayMerge extends true ? 'spread' : 'replace' }
>;

type RecursiveMerge<
  Target extends ValidObject,
  Sources extends unknown[],
  ArrayMerge extends boolean,
> = Sources extends [infer Source, ...infer Rest]
  ? Rest extends unknown[]
    ? RecursiveMerge<Merged<Target, Source, ArrayMerge>, Rest, ArrayMerge>
    : Merged<Target, Source, ArrayMerge>
  : Target;

export function merge<
  Target extends ValidObject,
  Sources extends ValidObjectOptional[],
  ArrayMerge extends boolean,
>(target: Target, isMergingArrays: ArrayMerge, ...objects: Sources) {
  let output = target;

  for (const object of objects) {
    if (!isEmpty(object)) {
      output = mergeTwo(output, object, isMergingArrays) as Target;
    }
  }

  return output as Simplify<RecursiveMerge<Target, Sources, ArrayMerge>>;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function mergeTwo<
  Target extends ValidObject,
  Source extends ValidObject,
  ArrayMerge extends boolean,
>(target?: Target, source?: Source, isMergingArrays = false as ArrayMerge) {
  if (isNil(target) || isNil(source)) {
    return (target ?? source ?? {}) as Merged<Target, Source, ArrayMerge>;
  }

  const output = { ...target } as Merged<Target, Source, ArrayMerge>;

  for (const key in source) {
    if (Object.hasOwn(source, key)) {
      const targetValue = target[key as unknown as keyof Target];
      const sourceValue = source[key as keyof Source];

      if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
        output[key] = isMergingArrays
          ? ([...targetValue, ...sourceValue] as MergedItem<
              Target,
              Source,
              ArrayMerge
            >)
          : (sourceValue as MergedItem<Target, Source, ArrayMerge>);
      } else if (isObject(targetValue) && isObject(sourceValue)) {
        // @ts-expect-error deep/recursive typing issue, ignore this here
        output[key] = mergeTwo(
          targetValue as ValidObject,
          sourceValue as ValidObject,
          isMergingArrays,
        );
      } else {
        output[key] = sourceValue as MergedItem<Target, Source, ArrayMerge>;
      }
    }
  }

  return output;
}
