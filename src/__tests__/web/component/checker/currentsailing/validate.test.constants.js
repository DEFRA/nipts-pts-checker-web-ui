// validate.test.constants.js
"use strict";

export const MONTH_CONSTANTS = {
  DAYS_28: 28,
  DAYS_29: 29,
  DAYS_30: 30,
  DAYS_31: 31,
  JANUARY: 1,
  FEBRUARY: 2,
  MARCH: 3,
  APRIL: 4,
  MAY: 5,
  JUNE: 6,
  JULY: 7,
  AUGUST: 8,
  SEPTEMBER: 9,
  OCTOBER: 10,
  NOVEMBER: 11,
  DECEMBER: 12,
};

export const TEST_CONSTANTS = {
  MONTH_CONSTANTS,

  MONTH_GROUPS: {
    MONTHS_WITH_31_DAYS: [MONTH_CONSTANTS.JANUARY,
      MONTH_CONSTANTS.MARCH,
      MONTH_CONSTANTS.MAY,
      MONTH_CONSTANTS.JULY,
      MONTH_CONSTANTS.AUGUST,
      MONTH_CONSTANTS.OCTOBER,
      MONTH_CONSTANTS.DECEMBER].map(month => MONTH_CONSTANTS[Object.keys(MONTH_CONSTANTS).find(key => MONTH_CONSTANTS[key] === month)]),
    MONTHS_WITH_30_DAYS: [MONTH_CONSTANTS.APRIL,
      MONTH_CONSTANTS.JUNE,
      MONTH_CONSTANTS.SEPTEMBER,
      MONTH_CONSTANTS.NOVEMBER,].map(month => MONTH_CONSTANTS[Object.keys(MONTH_CONSTANTS).find(key => MONTH_CONSTANTS[key] === month)]),
  },

  VALID_YEAR: 2024,
  INVALID_YEAR: 2023,
  DIVISIBLE_BY_400_YEAR: 2000,
  DIVISIBLE_BY_100_YEAR: 1900,

  VALID_MONTH: 1,
  INVALID_MONTH: 13,
  FEBRUARY: 2,
  APRIL: 4,

  VALID_DAY: 1,
  INVALID_DAY: 32,
  LEAP_DAY: 29,
  OUT_OF_BOUNDS_RANGE: 3,

  VALID_HOUR: "08",
  INVALID_HOUR: "8",
  MAX_HOUR: "23",

  VALID_MINUTE: "30",
  INVALID_MINUTE: "3",
  MAX_MINUTE: "59",

  VALID_ROUTE: "1",
  EMPTY_STRING: "",

  VALID_FLIGHT_NUMBERS: ["BA123", "QF 456", "EK789", "A1", "ABC123"],
  INVALID_FLIGHT_NUMBERS: [
    "",
    "  ",
    "BA  123",
    "TOOLONGFLIGHT",
    "BA/123",
    "!@#$",
  ],

  VALID_DATES: ["1/1/2024", "01/01/2024", "29/02/2024", "31/12/2024"],
  INVALID_DATES: [
    "",
    "//",
    "32/01/2024",
    "01/13/2024",
    "29/02/2023",
    "31/04/2024",
    "2024-01-01",
    "01-01-2024",
  ],

  TIME_VALUES: {
    PAST_HOURS: 47,
    FUTURE_HOURS: 23,
    DAYS_PAST: 5,
    DAYS_FUTURE: 5,
    ZERO_HOUR: "00",
    ZERO_MINUTE: "00",
    NOON_HOUR: "12",
    MAX_HOUR: "23",
    MAX_MINUTE: "59",
  },

  DATE_FORMAT: {
    DAY_PAD_LENGTH: 2,
    MONTH_PAD_LENGTH: 2,
    PAD_CHAR: "0",
    SEPARATOR: "/",
  },

  LEAP_YEAR_TEST_CASES: [
    { year: 2000, expected: true, desc: "divisible by 400" },
    { year: 2024, expected: true, desc: "divisible by 4 but not 100" },
    { year: 1900, expected: false, desc: "divisible by 100 but not 400" },
    { year: 2023, expected: false, desc: "not a leap year" },
  ],

  MONTH_DAYS_TEST_CASES: [
    { month: 1, year: 2024, expected: 31, desc: "January has 31 days" },
    { month: 4, year: 2024, expected: 30, desc: "April has 30 days" },
    { month: 2, year: 2024, expected: 29, desc: "February in leap year" },
    { month: 2, year: 2023, expected: 28, desc: "February in non-leap year" },
  ],

  ERROR_MESSAGES: {
    DATE_REQUIRED: "The date is required.",
    DATE_EMPTY: "The date cannot be empty.",
  },

  FEBRUARY_CONSTANTS: {
    NORMAL_DAYS: 28,
    LEAP_DAYS: 29,
  },
};