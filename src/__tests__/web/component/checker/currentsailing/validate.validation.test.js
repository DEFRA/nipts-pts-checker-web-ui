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

describe("Basic Input Validations", () => {
  describe("Route Option Radio", () => {
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

  describe("Route Radio Validation", () => {
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

    it("should invalidate undefined route radio", () => {
      const result = validateRouteRadio(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.routeError);
    });
  });
});

describe("Time Input Validations", () => {
  describe("Hour Validation", () => {
    it("should validate two-digit hour", () => {
      const result = validateSailingHour(TEST_CONSTANTS.VALID_HOUR);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it("should invalidate single-digit hour", () => {
      const result = validateSailingHour(TEST_CONSTANTS.INVALID_HOUR);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.timeError);
    });

    it("should validate maximum hour", () => {
      const result = validateSailingHour(TEST_CONSTANTS.TIME_VALUES.MAX_HOUR);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it("should validate zero hour", () => {
      const result = validateSailingHour(TEST_CONSTANTS.TIME_VALUES.ZERO_HOUR);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe("Minutes Validation", () => {
    it("should validate two-digit minutes", () => {
      const result = validateSailingMinutes(TEST_CONSTANTS.VALID_MINUTE);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it("should invalidate single-digit minutes", () => {
      const result = validateSailingMinutes(TEST_CONSTANTS.INVALID_MINUTE);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.timeError);
    });

    it("should validate maximum minutes", () => {
      const result = validateSailingMinutes(
        TEST_CONSTANTS.TIME_VALUES.MAX_MINUTE
      );
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it("should validate zero minutes", () => {
      const result = validateSailingMinutes(
        TEST_CONSTANTS.TIME_VALUES.ZERO_MINUTE
      );
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });
  });
});

describe("Flight Number Validations", () => {
  TEST_CONSTANTS.VALID_FLIGHT_NUMBERS.forEach((flightNumber) => {
    it(`should validate flight number: ${flightNumber}`, () => {
      const result = validateFlightNumber(flightNumber);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  TEST_CONSTANTS.INVALID_FLIGHT_NUMBERS.forEach((flightNumber) => {
    it(`should invalidate flight number: ${flightNumber}`, () => {
      const result = validateFlightNumber(flightNumber);
      expect(result.isValid).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  it("should invalidate undefined flight number", () => {
    const result = validateFlightNumber(undefined);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(CurrentSailingMainModelErrors.flightNoEmptyError);
  });
});

describe("Date Format Validations", () => {
  describe("Valid Date Formats", () => {
    TEST_CONSTANTS.VALID_DATES.forEach((date) => {
      it(`should validate correctly formatted date: ${date}`, () => {
        const result = validateDate(date);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeNull();
      });
    });
  });

  describe("Invalid Date Formats", () => {
    TEST_CONSTANTS.INVALID_DATES.forEach((date) => {
      it(`should invalidate incorrectly formatted date: ${date}`, () => {
        const result = validateDate(date);
        expect(result.isValid).toBe(false);
        expect(result.error).toBeTruthy();
      });
    });
  });
});

describe("Date Edge Cases", () => {
  describe("Special Date Cases", () => {
    it("should validate leap year February 29", () => {
      const result = validateDate("29/02/2024");
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it("should invalidate non-leap year February 29", () => {
      const result = validateDate("29/02/2023");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        CurrentSailingMainModelErrors.departureDateFormatError
      );
    });
  });

  describe("Invalid Date Cases", () => {
    it("should handle empty date", () => {
      const result = validateDate(TEST_CONSTANTS.EMPTY_STRING);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(TEST_CONSTANTS.ERROR_MESSAGES.DATE_EMPTY);
    });

    it("should handle undefined date", () => {
      const result = validateDate(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(TEST_CONSTANTS.ERROR_MESSAGES.DATE_REQUIRED);
    });

    it("should handle invalid separators", () => {
      const result = validateDate("01-01-2024");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        CurrentSailingMainModelErrors.departureDateFormatError
      );
    });
  });
});

describe("Date Range Basic Validations", () => {
  const formatTestDate = newFormattedDate();

  it("should validate current date and time", () => {
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

describe("Date Range Time Bounds", () => {
  const formatTestDate = newFormattedDate();

  describe("Past Time Bounds", () => {
    it("should validate near past boundary", () => {
      const now = new Date();
      const pastDate = new Date(now);
      pastDate.setHours(
        now.getHours() - (TEST_CONSTANTS.TIME_VALUES.PAST_HOURS - 1)
      );

      const result = validateDateRange(
        formatTestDate(pastDate),
        false,
        String(pastDate.getHours()).padStart(2, "0"),
        TEST_CONSTANTS.TIME_VALUES.ZERO_MINUTE
      );
      expect(result.isValid).toBe(true);
    });
  });

  describe("Future Time Bounds", () => {
    it("should validate near future boundary", () => {
      const now = new Date();
      const futureDate = new Date(now);
      futureDate.setHours(
        now.getHours() + (TEST_CONSTANTS.TIME_VALUES.FUTURE_HOURS - 1)
      );

      const result = validateDateRange(
        formatTestDate(futureDate),
        false,
        String(futureDate.getHours()).padStart(2, "0"),
        TEST_CONSTANTS.TIME_VALUES.ZERO_MINUTE
      );
      expect(result.isValid).toBe(true);
    });
  });
});

// Add these additional test blocks to the previous file:

describe("Time Format Edge Cases", () => {
  describe("Hour Special Characters", () => {
    it("should invalidate non-numeric hour", () => {
      const result = validateSailingHour("ab");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.timeError);
    });

    it("should invalidate special characters in hour", () => {
      const result = validateSailingHour("!@");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.timeError);
    });
  });

  describe("Minutes Special Characters", () => {
    it("should invalidate non-numeric minutes", () => {
      const result = validateSailingMinutes("xy");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.timeError);
    });

    it("should invalidate special characters in minutes", () => {
      const result = validateSailingMinutes("!@");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.timeError);
    });
  });
});

describe("Date Range Specific Time Validations", () => {
  const formatTestDate = (date) => {
    return [
      String(date.getDate()).padStart(TEST_CONSTANTS.DATE_FORMAT.DAY_PAD_LENGTH, TEST_CONSTANTS.DATE_FORMAT.PAD_CHAR),
      String(date.getMonth() + 1).padStart(TEST_CONSTANTS.DATE_FORMAT.MONTH_PAD_LENGTH, TEST_CONSTANTS.DATE_FORMAT.PAD_CHAR),
      date.getFullYear()
    ].join(TEST_CONSTANTS.DATE_FORMAT.SEPARATOR);
  };

  describe("Day Boundary Times", () => {
    it("should handle day start (00:00)", () => {
      const now = new Date();
      const result = validateDateRange(
        formatTestDate(now),
        false,
        TEST_CONSTANTS.TIME_VALUES.ZERO_HOUR,
        TEST_CONSTANTS.TIME_VALUES.ZERO_MINUTE
      );
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it("should handle day end (23:59)", () => {
      const now = new Date();
      const result = validateDateRange(
        formatTestDate(now),
        false,
        TEST_CONSTANTS.TIME_VALUES.MAX_HOUR,
        TEST_CONSTANTS.TIME_VALUES.MAX_MINUTE
      );
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe("Exact Boundary Tests", () => {
    it("should validate exactly -48 hours", () => {
      const now = new Date();
      const pastDate = new Date(now);
      pastDate.setHours(now.getHours() - TEST_CONSTANTS.TIME_VALUES.PAST_HOURS);
      
      const result = validateDateRange(
        formatTestDate(pastDate),
        false,
        String(pastDate.getHours()).padStart(2, "0"),
        String(pastDate.getMinutes()).padStart(2, "0")
      );
      expect(result.isValid).toBe(true);
    });

    it("should validate exactly +24 hours", () => {
      const now = new Date();
      const futureDate = new Date(now);
      futureDate.setHours(now.getHours() + TEST_CONSTANTS.TIME_VALUES.FUTURE_HOURS);
      
      const result = validateDateRange(
        formatTestDate(futureDate),
        false,
        String(futureDate.getHours()).padStart(2, "0"),
        String(futureDate.getMinutes()).padStart(2, "0")
      );
      expect(result.isValid).toBe(true);
    });
  });
});

describe("Date Format Special Cases", () => {
  it("should handle multiple forward slashes", () => {
    const result = validateDate("01//2024");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(CurrentSailingMainModelErrors.departureDateFormatError);
  });

 

  it("should handle day in 30-day month", () => {
    const result = validateDate("31/04/2024");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(CurrentSailingMainModelErrors.departureDateFormatError);
  });
});

function newFormattedDate() {
  return (date) => {
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
}
