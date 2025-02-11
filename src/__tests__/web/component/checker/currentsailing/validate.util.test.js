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

describe("Date Utility Edge Cases", () => {
  describe("February Special Cases", () => {
    it("should handle February in non-leap year", () => {
      const result = getDaysInMonth(
        TEST_CONSTANTS.MONTH_CONSTANTS.FEBRUARY,
        TEST_CONSTANTS.INVALID_YEAR
      );
      expect(result).toBe(TEST_CONSTANTS.FEBRUARY_CONSTANTS.NORMAL_DAYS);
    });

    it("should handle February in leap year", () => {
      const result = getDaysInMonth(
        TEST_CONSTANTS.MONTH_CONSTANTS.FEBRUARY,
        TEST_CONSTANTS.VALID_YEAR
      );
      expect(result).toBe(TEST_CONSTANTS.FEBRUARY_CONSTANTS.LEAP_DAYS);
    });
  });

  describe("Month Length Validations", () => {
    it("should handle 30-day month", () => {
      const result = getDaysInMonth(
        TEST_CONSTANTS.MONTH_CONSTANTS.APRIL,
        TEST_CONSTANTS.VALID_YEAR
      );
      expect(result).toBe(TEST_CONSTANTS.MONTH_CONSTANTS.DAYS_30);
    });

    it("should handle 31-day month", () => {
      const result = getDaysInMonth(
        TEST_CONSTANTS.MONTH_CONSTANTS.JANUARY,
        TEST_CONSTANTS.VALID_YEAR
      );
      expect(result).toBe(TEST_CONSTANTS.MONTH_CONSTANTS.DAYS_31);
    });
  });
});
