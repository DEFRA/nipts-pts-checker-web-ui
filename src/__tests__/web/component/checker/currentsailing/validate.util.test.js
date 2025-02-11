// validate.util.test.js
"use strict";
import {
  isLeapYear,
  getDaysInMonth,
} from "../../../../../web/component/checker/currentsailing/validate.js";
import { TEST_CONSTANTS } from "./validate.test.constants";

describe("Date Utility Functions - Leap Year", () => {
  TEST_CONSTANTS.LEAP_YEAR_TEST_CASES.forEach(({ year, expected, desc }) => {
    it(`should return ${expected} for year ${year} (${desc})`, () => {
      expect(isLeapYear(year)).toBe(expected);
    });
  });
});

describe("Date Utility Functions - Days In Month", () => {
  TEST_CONSTANTS.MONTH_DAYS_TEST_CASES.forEach(
    ({ month, year, expected, desc }) => {
      it(desc, () => {
        expect(getDaysInMonth(month, year)).toBe(expected);
      });
    }
  );
});

describe("Date Utility Additional Cases", () => {
  describe("isLeapYear Edge Cases", () => {
    it("should validate year at century boundary", () => {
      expect(isLeapYear(TEST_CONSTANTS.DIVISIBLE_BY_100_YEAR)).toBe(false);
    });

    it("should validate year at 400 year boundary", () => {
      expect(isLeapYear(TEST_CONSTANTS.DIVISIBLE_BY_400_YEAR)).toBe(true);
    });
  });

  describe("getDaysInMonth Edge Cases", () => {
    it("should handle February in non-leap year", () => {
      const result = getDaysInMonth(
        TEST_CONSTANTS.FEBRUARY,
        TEST_CONSTANTS.INVALID_YEAR
      );
      expect(result).toBe(28);
    });

    it("should handle February in leap year", () => {
      const result = getDaysInMonth(
        TEST_CONSTANTS.FEBRUARY,
        TEST_CONSTANTS.VALID_YEAR
      );
      expect(result).toBe(29);
    });

    it("should handle 30-day month", () => {
      const result = getDaysInMonth(
        TEST_CONSTANTS.APRIL,
        TEST_CONSTANTS.VALID_YEAR
      );
      expect(result).toBe(30);
    });
  });
});
