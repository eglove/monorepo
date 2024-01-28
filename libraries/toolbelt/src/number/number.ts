import type {
  Angle,
  Area,
  Data,
  Energy,
  Force,
  Length,
  Mass,
  Power,
  Pressure,
  Temperature,
  Time,
  Volume,
} from 'convert';
import { convert } from 'convert';

import { isBigIntOrNumber } from '../is/big-int-or-number.ts';
import { isNil } from '../is/nil.ts';

type FormatOptions = Intl.NumberFormatOptions & BigIntToLocaleStringOptions;

type ConversionUnit =
  | Angle
  | Area
  | Data
  | Energy
  | Force
  | Length
  | Mass
  | Power
  | Pressure
  | Temperature
  | Time
  | Volume;

type IsSameFamily<T extends ConversionUnit> = T extends Angle
  ? Angle
  : T extends Area
    ? Area
    : T extends Data
      ? Data
      : T extends Energy
        ? Energy
        : T extends Force
          ? Force
          : T extends Length
            ? Length
            : T extends Mass
              ? Mass
              : T extends Power
                ? Power
                : T extends Pressure
                  ? Pressure
                  : T extends Temperature
                    ? Temperature
                    : T extends Time
                      ? Time
                      : T extends Volume
                        ? Volume
                        : never;

class BetterNumber {
  private readonly _locale?: Intl.LocalesArgument;
  private readonly _number?: number | bigint;
  private readonly _formatOptions?: FormatOptions;

  public constructor(
    number: unknown,
    locale?: string,
    formatOptions?: FormatOptions,
  ) {
    this._formatOptions = formatOptions;

    if (typeof number === 'bigint' || typeof number === 'number') {
      this._number = number;
    } else if (typeof number === 'string' && isBigIntOrNumber(number)) {
      this._number =
        Number(number) > Number.MAX_SAFE_INTEGER
          ? BigInt(number)
          : Number(number);
    }

    if (isNil(locale) && typeof navigator !== 'undefined') {
      this._locale = navigator.language;
    } else if (!isNil(locale)) {
      this._locale = locale;
    }
  }

  public convert<From extends ConversionUnit, To extends IsSameFamily<From>>(
    from: From,
    to: To,
  ) {
    if (!isNil(this._number)) {
      // @ts-expect-error ugh... this gives proper autocomplete
      return convert(this._number, from).to(to);
    }
  }

  public get locale(): Intl.LocalesArgument {
    return this._locale;
  }

  public get number(): number | bigint | undefined {
    return this._number;
  }

  public format(options?: FormatOptions): string | undefined {
    if (isNil(this._number)) {
      return undefined;
    }

    return Number(this._number).toLocaleString(
      this._locale,
      options ?? this._formatOptions,
    );
  }
}

export const betterNumber = (
  number: unknown,
  locale?: string,
  formatOptions?: FormatOptions,
): BetterNumber => {
  return new BetterNumber(number, locale, formatOptions);
};
