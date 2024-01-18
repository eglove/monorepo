import { describe, expect, it } from 'vitest';

import { betterNumber } from '../../src/number/number.ts';

describe('BetterNumber', () => {
  it('should accept bigint', () => {
    const value = betterNumber(BigInt(123));

    expect(value.number).toBe(BigInt(123));
  });

  it('should accept number', () => {
    const value = betterNumber(123);

    expect(value.number).toBe(123);
  });

  it('should accept BigInt string', () => {
    const value = betterNumber('12345678901234567890');

    expect(value.number).toBe(BigInt('12345678901234567890'));
  });

  it('should accept number string', () => {
    const value = betterNumber('123');

    expect(value.number).toBe(123);
  });

  it('should use navigators language when undefined', () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: {
        language: 'fr',
      },
    });

    const value = betterNumber(123);
    expect(value.locale).toBe('fr');
  });

  it('should format correctly', () => {
    const englishUs = betterNumber(1000, 'en-US', {
      style: 'unit',
      unit: 'inch',
    });

    expect(englishUs.number).toBe(1000);
    expect(englishUs.locale).toBe('en-US');
    expect(englishUs.format()).toBe('1,000 in');

    const portugueseBrazil = betterNumber(1000, 'pt-BR', {
      style: 'unit',
      unit: 'inch',
    });

    expect(portugueseBrazil.locale).toBe('pt-BR');
    expect(portugueseBrazil.format()).toBe('1.000 pol.');
  });

  it('should return undefined if number is NaN', () => {
    const length = betterNumber(undefined, 'en-US');

    expect(length.number).toBe(undefined);
    expect(length.format()).toBe(undefined);
  });

  it('should return undefined when number is null', () => {
    const height = betterNumber(null, 'en-US');

    expect(height.number).toBe(undefined);
    expect(height.format()).toBe(undefined);
  });
});
