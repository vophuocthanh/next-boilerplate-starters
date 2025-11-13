export const STANDARD_DATE_TIME_REGEX_WITHOUT_TIMEZONE =
  /^[0-9]{4}-[0-9]{2}-[0-9]{2}[\sT][0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{1,3})?$/;

export const STANDARD_DATE_TIME_REGEX =
  /^([0-9]{4}-[0-9]{2}-[0-9]{2})[\sT]([0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{1,3})?)(Z|[+-][0-9]{2}:[0-9]{2})?$/;

export const STANDARD_DATE_REGEX = /^[0-9]{4}-[0-9]{2}-[0-9]{2}?$/;

export const STANDARD_TIME_REGEX = /^[0-9]{2}:[0-9]{2}?$/;

export const NAME_BANK_REGEX = /^[^\t\n"']*$/;

export const ACCOUNT_BANK_REGEX = /^[a-zA-Z0-9]*$/;

export const PHONE_NUMBER_REGEX = /^[0-9\s()+-]*$/;

export const DESCRIPTION_REGEX = /^[^\t\n]*$/;

export const CHARACTER_TAB_REGEX = /\s{2,}/;

export const SUPPLIER_TAX_CODE_REGEX = /^([A-Za-z0-9\-_&]*)$/;

export const NOT_TAB_ENTER_REGEX = /^[^\t\r\n]*$/;

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const NOT_SPECIAL_CHARACTERS = /^[a-zA-Z0-9À-ỹ\s]*$/;
