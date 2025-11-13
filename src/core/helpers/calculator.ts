import { isEqual, isNil, multiply, sum } from "lodash";

import { NUMBER_CONSTANTS, VND_CURRENCY_UNIT } from "@/core/helpers/consts";

export const toFixedNumber = (
  value: number,
  fractionDigits = NUMBER_CONSTANTS.TWO,
) => {
  if (isNil(value)) return undefined;

  return Number(value.toFixed(fractionDigits));
};

export const sumWithFixed = (params: number[]) => {
  return toFixedNumber(sum(params), NUMBER_CONSTANTS.FOUR);
};

export const exchangeCurrencyWithFixed = (
  money: number,
  exchangeRate: number,
) => {
  return toFixedNumber(multiply(exchangeRate, money), NUMBER_CONSTANTS.ZERO);
};

export const multiplyWithFixed = (a: number, b: number) => {
  return toFixedNumber(multiply(a, b), NUMBER_CONSTANTS.ZERO);
};

export const dividedWithFixed = (a: number, b: number) => {
  return toFixedNumber(a / b, NUMBER_CONSTANTS.ZERO);
};

export const toFixedByCurrency = (value: number, currencyCode: string) => {
  return toFixedNumber(
    value,
    isEqual(currencyCode, VND_CURRENCY_UNIT)
      ? NUMBER_CONSTANTS.ZERO
      : undefined,
  );
};
