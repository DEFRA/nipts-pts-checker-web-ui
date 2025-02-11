// validate.validation.test.js
"use strict";
import {
  validateRouteOptionRadio,
  validateRouteRadio,
  validateSailingHour,
  validateSailingMinutes,
  validateFlightNumber,
  validateDate,
  validateDateRange,
} from "../../../../../web/component/checker/currentsailing/validate.js";
import { CurrentSailingMainModelErrors } from "../../../../../constants/currentSailingConstant.js";
import { TEST_CONSTANTS } from "./validate.test.constants";

describe("Route Option Validations", () => {
  it("should validate valid route option", () => {
    const result = validateRouteOptionRadio(TEST_CONSTANTS.VALID_ROUTE);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeNull();
  });

  it("should invalidate empty route option", () => {
    const result = validateRouteOptionRadio(TEST_CONSTANTS.EMPTY_STRING);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(CurrentSailingMainModelErrors.routeOptionError);
  });

  it("should invalidate undefined route option", () => {
    const result = validateRouteOptionRadio(undefined);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(CurrentSailingMainModelErrors.routeOptionError);
  });
});

describe("Route Radio Validations", () => {
  it("should validate valid route radio", () => {
    const result = validateRouteRadio(TEST_CONSTANTS.VALID_ROUTE);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeNull();
  });

  it("should invalidate empty route radio", () => {
    const result = validateRouteRadio(TEST_CONSTANTS.EMPTY_STRING);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(CurrentSailingMainModelErrors.routeError);
  });
});

describe("Time Input Validations", () => {
  describe("Sailing Hour Validation", () => {
    it("should validate proper two-digit hour", () => {
      const result = validateSailingHour(TEST_CONSTANTS.VALID_HOUR);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it("should invalidate single-digit hour", () => {
      const result = validateSailingHour(TEST_CONSTANTS.INVALID_HOUR);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.timeError);
    });

    it("should validate maximum valid hour", () => {
      const result = validateSailingHour(TEST_CONSTANTS.TIME_VALUES.MAX_HOUR);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe("Sailing Minutes Validation", () => {
    it("should validate proper two-digit minutes", () => {
      const result = validateSailingMinutes(TEST_CONSTANTS.VALID_MINUTE);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it("should invalidate single-digit minutes", () => {
      const result = validateSailingMinutes(TEST_CONSTANTS.INVALID_MINUTE);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.timeError);
    });

    it("should validate maximum valid minutes", () => {
      const result = validateSailingMinutes(TEST_CONSTANTS.TIME_VALUES.MAX_MINUTE);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });
  });
});

describe("Flight Number Validations", () => {
  TEST_CONSTANTS.VALID_FLIGHT_NUMBERS.forEach(flightNumber => {
    it(`should validate flight number: ${flightNumber}`, () => {
      const result = validateFlightNumber(flightNumber);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  TEST_CONSTANTS.INVALID_FLIGHT_NUMBERS.forEach(flightNumber => {
    it(`should invalidate flight number: ${flightNumber}`, () => {
      const result = validateFlightNumber(flightNumber);
      expect(result.isValid).toBe(false);
    });
  });
});

describe("Date String Validations", () => {
  TEST_CONSTANTS.VALID_DATES.forEach(date => {
    it(`should validate date: ${date}`, () => {
      const result = validateDate(date);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  TEST_CONSTANTS.INVALID_DATES.forEach(date => {
    it(`should invalidate date: ${date}`, () => {
      const result = validateDate(date);
      expect(result.isValid).toBe(false);
    });
  });
});

describe("Date Range Core Validations", () => {
  const formatTestDate = (date) => {
    return [
      String(date.getDate()).padStart(TEST_CONSTANTS.DATE_FORMAT.DAY_PAD_LENGTH, TEST_CONSTANTS.DATE_FORMAT.PAD_CHAR),
      String(date.getMonth() + 1).padStart(TEST_CONSTANTS.DATE_FORMAT.MONTH_PAD_LENGTH, TEST_CONSTANTS.DATE_FORMAT.PAD_CHAR),
      date.getFullYear()
    ].join(TEST_CONSTANTS.DATE_FORMAT.SEPARATOR);
  };

  it("should validate current date", () => {
    const now = new Date();
    const result = validateDateRange(
      formatTestDate(now),
      false,
      TEST_CONSTANTS.TIME_VALUES.NOON_HOUR,
      TEST_CONSTANTS.TIME_VALUES.ZERO_MINUTE
    );
    expect(result.isValid).toBe(true);
    expect(result.error).toBeNull();
  });

  it("should validate with zero hour flag", () => {
    const now = new Date();
    const result = validateDateRange(formatTestDate(now), true);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeNull();
  });
});

describe("Date Range Boundary Validations", () => {
  const formatTestDate = (date) => {
    return [
      String(date.getDate()).padStart(
        TEST_CONSTANTS.DATE_FORMAT.DAY_PAD_LENGTH,
        TEST_CONSTANTS.DATE_FORMAT.PAD_CHAR
      ),
      String(date.getMonth() + 1).padStart(
        TEST_CONSTANTS.DATE_FORMAT.MONTH_PAD_LENGTH,
        TEST_CONSTANTS.DATE_FORMAT.PAD_CHAR
      ),
      date.getFullYear(),
    ].join(TEST_CONSTANTS.DATE_FORMAT.SEPARATOR);
  };

  describe("Past Time Boundaries", () => {
    it("should validate date within past hours limit", () => {
      const now = new Date();
      const pastDate = new Date(now);
      pastDate.setHours(now.getHours() - TEST_CONSTANTS.TIME_VALUES.PAST_HOURS);

      const result = validateDateRange(
        formatTestDate(pastDate),
        false,
        String(pastDate.getHours()).padStart(2, "0"),
        TEST_CONSTANTS.TIME_VALUES.ZERO_MINUTE
      );
      expect(result.isValid).toBe(true);
    });

    it("should invalidate date beyond past limit", () => {
      const now = new Date();
      const pastDate = new Date(now);
      pastDate.setDate(
        pastDate.getDate() - TEST_CONSTANTS.TIME_VALUES.DAYS_PAST
      );

      const result = validateDateRange(
        formatTestDate(pastDate),
        false,
        TEST_CONSTANTS.TIME_VALUES.NOON_HOUR,
        TEST_CONSTANTS.TIME_VALUES.ZERO_MINUTE
      );
      expect(result.isValid).toBe(false);
    });
  });

  describe("Future Time Boundaries", () => {
    it("should validate date within future hours limit", () => {
      const now = new Date();
      const futureDate = new Date(now);
      futureDate.setHours(
        now.getHours() + TEST_CONSTANTS.TIME_VALUES.FUTURE_HOURS
      );

      const result = validateDateRange(
        formatTestDate(futureDate),
        false,
        String(futureDate.getHours()).padStart(2, "0"),
        TEST_CONSTANTS.TIME_VALUES.ZERO_MINUTE
      );
      expect(result.isValid).toBe(true);
    });

    it("should invalidate date beyond future limit", () => {
      const now = new Date();
      const futureDate = new Date(now);
      futureDate.setDate(
        futureDate.getDate() + TEST_CONSTANTS.TIME_VALUES.DAYS_FUTURE
      );

      const result = validateDateRange(
        formatTestDate(futureDate),
        false,
        TEST_CONSTANTS.TIME_VALUES.NOON_HOUR,
        TEST_CONSTANTS.TIME_VALUES.ZERO_MINUTE
      );
      expect(result.isValid).toBe(false);
    });
  });

  describe("Zero Hour Boundaries", () => {
    it("should validate with zero hour start", () => {
      const now = new Date();
      const result = validateDateRange(
        formatTestDate(now),
        false,
        TEST_CONSTANTS.TIME_VALUES.ZERO_HOUR,
        TEST_CONSTANTS.TIME_VALUES.ZERO_MINUTE
      );
      expect(result.isValid).toBe(true);
    });

    it("should validate with max hour boundary", () => {
      const now = new Date();
      const result = validateDateRange(
        formatTestDate(now),
        false,
        TEST_CONSTANTS.TIME_VALUES.MAX_HOUR,
        TEST_CONSTANTS.TIME_VALUES.MAX_MINUTE
      );
      expect(result.isValid).toBe(true);
    });

    it("should validate with isZeroHour flag", () => {
      const now = new Date();
      const result = validateDateRange(formatTestDate(now), true);
      expect(result.isValid).toBe(true);
    });
  });
});

describe("Date Edge Cases", () => {
  it("should handle malformed date string", () => {
    const result = validateDate("2024-01-01");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(
      CurrentSailingMainModelErrors.departureDateFormatError
    );
  });

  it("should handle empty date string", () => {
    const result = validateDate(TEST_CONSTANTS.EMPTY_STRING);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(TEST_CONSTANTS.ERROR_MESSAGES.DATE_EMPTY);
  });

  it("should handle undefined date", () => {
    const result = validateDate(undefined);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(TEST_CONSTANTS.ERROR_MESSAGES.DATE_REQUIRED);
  });

  it("should handle invalid month boundary", () => {
    const result = validateDate("01/13/2024");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(
      CurrentSailingMainModelErrors.departureDateFormatError
    );
  });

  it("should handle invalid day boundary", () => {
    const result = validateDate("32/01/2024");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(
      CurrentSailingMainModelErrors.departureDateFormatError
    );
  });

  it("should handle leap year date validation", () => {
    const result = validateDate("29/02/2024");
    expect(result.isValid).toBe(true);
    expect(result.error).toBe(null);
  });

  it("should handle non-leap year February validation", () => {
    const result = validateDate("29/02/2023");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(
      CurrentSailingMainModelErrors.departureDateFormatError
    );
  });
});