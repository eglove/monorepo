import { describe, expect, it } from 'vitest';

import { isBigIntOrNumber } from '../../src/is/big-int-or-number.ts';

describe('number', () => {
  it.each([
    [0 / 0, false],
    ['not a number', false],
    [undefined, false],
    [null, false],
    ['2', true],
    [2, true],
  ])('should work', (number, expected) => {
    expect(isBigIntOrNumber(number)).toBe(expected);
  });
});
