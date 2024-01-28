import { describe, expect, it } from 'vitest';

import { merge } from '../../src/object/merge.ts';

describe('merge', () => {
  it('should return original if objects are equal', () => {
    const equalObject = { a: 1, b: 2 };
    const result = merge(equalObject, true, equalObject);

    expect(result).toStrictEqual(equalObject);
  });

  it('should merge objects', () => {
    const target = {
      a: 20,
      b: null,
      c: { from: 30, to: 60 },
      d: [1, 2],
    } as const;

    const source = {
      a: 10,
      b: undefined,
      c: { from: 50 },
      d: [3],
    } as const;

    const result = merge(target, true, source);

    expect(target).toStrictEqual({
      a: 20,
      b: null,
      c: { from: 30, to: 60 },
      d: [1, 2],
    });

    expect(source).toStrictEqual({
      a: 10,
      b: undefined,
      c: { from: 50 },
      d: [3],
    });

    expect(result).toStrictEqual({
      a: 10,
      b: undefined,
      c: { from: 50, to: 60 },
      d: [1, 2, 3],
    });
  });

  it('should merge four complex objects', () => {
    const object1 = { a: 1, b: { x: 10, y: 20 }, c: [1, 2, 3] } as const;
    const object2 = { a: 2, b: { x: 15, z: 30 }, d: 'string1' } as const;
    const object3 = { a: 3, b: { y: 25, z: 35 }, e: { f: 'string2' } } as const;
    const object4 = {
      a: 4,
      b: { x: 20, y: 30, z: 40 },
      c: [4, 5, 6],
      e: { g: 'string3' },
    } as const;

    const result = merge(object1, true, object2, object3, object4);

    const expected = {
      a: 4,
      b: { x: 20, y: 30, z: 40 },
      c: [1, 2, 3, 4, 5, 6],
      d: 'string1',
      e: { f: 'string2', g: 'string3' },
    };

    expect(result).toStrictEqual(expected);
  });
});
