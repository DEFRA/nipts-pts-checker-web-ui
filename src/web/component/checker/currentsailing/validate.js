"use strict";
import Joi from "joi";
import { CurrentSailingMainModelErrors } from "../../../../constants/currentSailingConstant.js";

export const MONTH_CONSTANTS = {
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

const MONTHS_WITH_31_DAYS = [
  MONTH_CONSTANTS.JANUARY,
  MONTH_CONSTANTS.MARCH,
  MONTH_CONSTANTS.MAY,
  MONTH_CONSTANTS.JULY,
  MONTH_CONSTANTS.AUGUST,
  MONTH_CONSTANTS.OCTOBER,
  MONTH_CONSTANTS.DECEMBER,
].map(
  (month) =>
    MONTH_CONSTANTS[
      Object.keys(MONTH_CONSTANTS).find((key) => MONTH_CONSTANTS[key] === month)
    ]
);
const MONTHS_WITH_30_DAYS = [
  MONTH_CONSTANTS.APRIL,
  MONTH_CONSTANTS.JUNE,
  MONTH_CONSTANTS.SEPTEMBER,
  MONTH_CONSTANTS.NOVEMBER,
].map(
  (month) =>
    MONTH_CONSTANTS[
      Object.keys(MONTH_CONSTANTS).find((key) => MONTH_CONSTANTS[key] === month)
    ]
);

const DATE_FORMAT_REGEX = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
const TWO_DIGIT_REGEX = /^\d{2}$/;
const FLIGHT_NUMBER_REGEX = /^(?=.{1,8}$)[A-Za-z0-9]+( [A-Za-z0-9]+)*$/;
const PAST_HOURS_LIMIT = 48;
const FUTURE_HOURS_LIMIT = 24;
const ZERO_HOUR_START = 0;
const ZERO_HOUR_END = 23;
const ZERO_MINUTES_START = 0;
const ZERO_MINUTES_END = 59;
const ZERO_SECONDS_START = 0;
const ZERO_SECONDS_END = 59;
const ZERO_MS_START = 0;
const ZERO_MS_END = 999;
const MIN_MONTH = 1;
const MAX_MONTH = 12;
const MIN_DAY = 1;
const LEAP_YEAR_DIVISOR_4 = 4;
const LEAP_YEAR_DIVISOR_100 = 100;
const LEAP_YEAR_DIVISOR_400 = 400;
const FEBRUARY_LEAP_DAYS = 29;
const FEBRUARY_NORMAL_DAYS = 28;
const DAYS_31 = 31;
const DAYS_30 = 30;
const DATE_PARTS_SEPARATOR = "/";
const MONTH_INDEX_OFFSET = 1;

const SCHEMA_LABELS = {
  ROUTE_OPTION: "RouteOption",
  ROUTE: "Route",
  FLIGHT: "Flight",
  SAILING_HOUR: "Sailing Hour",
  SAILING_MINUTES: "Sailing Minutes",
  DATE: "Date",
};

const ERROR_TYPES = {
  DATE_FORMAT: "date.format",
  DATE_REQUIRED: "date.required",
  STRING_EMPTY: "string.empty",
  PATTERN_BASE: "string.pattern.base",
  ANY_REQUIRED: "any.required",
};

const ERROR_MESSAGES = {
  DATE_REQUIRED_TEXT: "The date is required.",
  DATE_EMPTY: "The date cannot be empty.",
};

const isLeapYear = (year) =>
  (year % LEAP_YEAR_DIVISOR_4 === ZERO_HOUR_START &&
    year % LEAP_YEAR_DIVISOR_100 !== ZERO_HOUR_START) ||
  year % LEAP_YEAR_DIVISOR_400 === ZERO_HOUR_START;

const getDaysInMonth = (month, year) => {
  if (MONTHS_WITH_31_DAYS.includes(month)) {
    return DAYS_31;
  }
  if (MONTHS_WITH_30_DAYS.includes(month)) {
    return DAYS_30;
  }
  return isLeapYear(year) ? FEBRUARY_LEAP_DAYS : FEBRUARY_NORMAL_DAYS;
};

const routeOptionRadioSchema = Joi.string()
  .required()
  .label(SCHEMA_LABELS.ROUTE_OPTION)
  .messages({
    [ERROR_TYPES.STRING_EMPTY]: CurrentSailingMainModelErrors.routeOptionError,
    [ERROR_TYPES.ANY_REQUIRED]: CurrentSailingMainModelErrors.routeOptionError,
  });

const routeRadioSchema = Joi.string()
  .required()
  .label(SCHEMA_LABELS.ROUTE)
  .messages({
    [ERROR_TYPES.STRING_EMPTY]: CurrentSailingMainModelErrors.routeError,
    [ERROR_TYPES.ANY_REQUIRED]: CurrentSailingMainModelErrors.routeError,
  });

const flightSchema = Joi.string()
  .pattern(FLIGHT_NUMBER_REGEX)
  .required()
  .label(SCHEMA_LABELS.FLIGHT)
  .messages({
    [ERROR_TYPES.STRING_EMPTY]:
      CurrentSailingMainModelErrors.flightNoEmptyError,
    [ERROR_TYPES.PATTERN_BASE]:
      CurrentSailingMainModelErrors.flightNumberFormatError,
    [ERROR_TYPES.ANY_REQUIRED]:
      CurrentSailingMainModelErrors.flightNoEmptyError,
  });

const sailingHourSchema = Joi.string()
  .pattern(TWO_DIGIT_REGEX)
  .required()
  .label(SCHEMA_LABELS.SAILING_HOUR)
  .messages({
    [ERROR_TYPES.STRING_EMPTY]: CurrentSailingMainModelErrors.timeError,
    [ERROR_TYPES.PATTERN_BASE]: CurrentSailingMainModelErrors.timeError,
    [ERROR_TYPES.ANY_REQUIRED]: CurrentSailingMainModelErrors.timeError,
  });

const sailingMinutesSchema = Joi.string()
  .pattern(TWO_DIGIT_REGEX)
  .required()
  .label(SCHEMA_LABELS.SAILING_MINUTES)
  .messages({
    [ERROR_TYPES.STRING_EMPTY]: CurrentSailingMainModelErrors.timeError,
    [ERROR_TYPES.PATTERN_BASE]: CurrentSailingMainModelErrors.timeError,
    [ERROR_TYPES.ANY_REQUIRED]: CurrentSailingMainModelErrors.timeError,
  });

const dateSchema = Joi.string()
  .required()
  .custom((value, helpers) => {
    const parts = value.split(DATE_PARTS_SEPARATOR);
    const noDateProvided = parts.every((part) => part.trim() === "");
    if (noDateProvided) {
      return helpers.error(ERROR_TYPES.DATE_REQUIRED);
    }
    const match = value.match(DATE_FORMAT_REGEX);
    if (!match) {
      return helpers.error(ERROR_TYPES.DATE_FORMAT);
    }
    const [, day, month, year] = match.map((part) => parseInt(part, 10));
    if (month < MIN_MONTH || month > MAX_MONTH) {
      return helpers.error(ERROR_TYPES.DATE_FORMAT);
    }
    const maxDays = getDaysInMonth(month, year);
    if (day < MIN_DAY || day > maxDays) {
      return helpers.error(ERROR_TYPES.DATE_FORMAT);
    }
    return value;
  })
  .label(SCHEMA_LABELS.DATE)
  .messages({
    [ERROR_TYPES.DATE_FORMAT]:
      CurrentSailingMainModelErrors.departureDateFormatError,
    [ERROR_TYPES.DATE_REQUIRED]:
      CurrentSailingMainModelErrors.departureDateRequiredError,
    [ERROR_TYPES.ANY_REQUIRED]: ERROR_MESSAGES.DATE_REQUIRED_TEXT,
    [ERROR_TYPES.STRING_EMPTY]: ERROR_MESSAGES.DATE_EMPTY,
  });

const validateRouteOptionRadio = (radioOptionSelection) => {
  const { error } = routeOptionRadioSchema.validate(radioOptionSelection);
  return {
    isValid: !error,
    error: error ? error.details[0].message : null,
  };
};

const validateRouteRadio = (radioSelection) => {
  const { error } = routeRadioSchema.validate(radioSelection);
  return {
    isValid: !error,
    error: error ? error.details[0].message : null,
  };
};

const validateFlightNumber = (flightNumber) => {
  const { error } = flightSchema.validate(flightNumber);
  return {
    isValid: !error,
    error: error ? error.details[0].message : null,
  };
};

const validateDate = (date) => {
  const { error } = dateSchema.validate(date);
  return {
    isValid: !error,
    error: error ? error.details[0].message : null,
  };
};

const validateSailingHour = (sailingHour) => {
  const { error } = sailingHourSchema.validate(sailingHour);
  return {
    isValid: !error,
    error: error ? error.details[0].message : null,
  };
};

const validateSailingMinutes = (sailingMinutes) => {
  const { error } = sailingMinutesSchema.validate(sailingMinutes);
  return {
    isValid: !error,
    error: error ? error.details[0].message : null,
  };
};

const validateDateRange = (
  dateString,
  isZeroHour = false,
  sailingHour = ZERO_HOUR_START,
  sailingMinutes = ZERO_MINUTES_START
) => {
  const now = new Date();
  const [day, month, year] = dateString.split(DATE_PARTS_SEPARATOR).map(Number);
  const sailingDate = new Date(year, month - MONTH_INDEX_OFFSET, day);

  if (!isZeroHour) {
    sailingDate.setHours(
      sailingHour,
      sailingMinutes,
      ZERO_SECONDS_START,
      ZERO_MS_START
    );
  } else {
    sailingDate.setHours(
      ZERO_HOUR_START,
      ZERO_MINUTES_START,
      ZERO_SECONDS_START,
      ZERO_MS_START
    );
  }

  const lowerBound = new Date(
    now.getTime() - PAST_HOURS_LIMIT * 60 * 60 * 1000
  );
  const upperBound = new Date(
    now.getTime() + FUTURE_HOURS_LIMIT * 60 * 60 * 1000
  );

  lowerBound.setSeconds(0, 0);
  upperBound.setSeconds(0, 0);

  if (isZeroHour) {
    const dayStart = new Date(sailingDate);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(sailingDate);
    dayEnd.setHours(23, 59, 59, 999);

    if (dayEnd >= lowerBound && dayStart <= upperBound) {
      return { isValid: true, error: null };
    }
  } else {
    if (sailingDate >= lowerBound && sailingDate <= upperBound) {
      return { isValid: true, error: null };
    }
  }

  return {
    isValid: false,
    error: CurrentSailingMainModelErrors.timeOutOfBoundsError,
  };
};

export {
  validateRouteOptionRadio,
  validateRouteRadio,
  validateSailingHour,
  validateSailingMinutes,
  validateFlightNumber,
  validateDate,
  validateDateRange,
  isLeapYear,
  getDaysInMonth,
};
