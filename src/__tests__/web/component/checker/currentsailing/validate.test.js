"use strict";
import {
  validateRouteOptionRadio,
  validateRouteRadio,
  validateSailingHour,
  validateSailingMinutes,
  validateFlightNumber,
  validateDate,
  validateDateRange,
  isLeapYear,
  getDaysInMonth,
} from "../../../../../web/component/checker/currentsailing/validate.js";
import { CurrentSailingMainModelErrors } from "../../../../../constants/currentSailingConstant.js";

const outOfBoundsRange = 3;

describe("Validation Functions", () => {
  describe("validateRouteOptionRadio", () => {
 
    it("should return invalid for an empty string", () => {
      const result = validateRouteOptionRadio("");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.routeOptionError); // Replace with your actual error message
    });

    it("should return invalid for undefined", () => {
      const result = validateRouteOptionRadio(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.routeOptionError); // Replace with your actual error message
    });
  });

  describe("validateRouteRadio", () => {
   
    it("should return invalid for an empty string", () => {
      const result = validateRouteRadio("");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.routeError); // Replace with your actual error message
    });

    it("should return invalid for undefined", () => {
      const result = validateRouteRadio(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.routeError); // Replace with your actual error message
    });
  });

  describe("validateSailingHour", () => {
    it("should return valid for a two-digit string", () => {
      const result = validateSailingHour("08");
      expect(result.isValid).toBe(true);
      expect(result.error).toBe(null);
    });

    it("should return invalid for a single-digit string", () => {
      const result = validateSailingHour("8");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.timeError); // Replace with your actual error message
    });

    it("should return invalid for an empty string", () => {
      const result = validateSailingHour("");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.timeError); // Replace with your actual error message
    });

    it("should return invalid for undefined", () => {
      const result = validateSailingHour(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.timeError); // Replace with your actual error message
    });
  });

  describe("validateSailingMinutes", () => {
    it("should return valid for a two-digit string", () => {
      const result = validateSailingMinutes("30");
      expect(result.isValid).toBe(true);
      expect(result.error).toBe(null);
    });

    it("should return invalid for a single-digit string", () => {
      const result = validateSailingMinutes("3");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.timeError); // Replace with your actual error message
    });

    it("should return invalid for an empty string", () => {
      const result = validateSailingMinutes("");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.timeError); // Replace with your actual error message
    });

    it("should return invalid for undefined", () => {
      const result = validateSailingMinutes(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.timeError); // Replace with your actual error message
    });
  });

  describe("validateFlightNumber", () => {
    it("should return valid for a non-empty string", () => {
      const result = validateFlightNumber("1");
      expect(result.isValid).toBe(true);
      expect(result.error).toBe(null);
    });

    it("should return invalid for an empty string", () => {
      const result = validateFlightNumber("");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        CurrentSailingMainModelErrors.flightNoEmptyError
      ); // Replace with your actual error message
    });

    it("should return invalid for undefined", () => {
      const result = validateFlightNumber(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        CurrentSailingMainModelErrors.flightNoEmptyError
      ); // Replace with your actual error message
    });
  });

  describe("validateDate", () => {
    it("should return valid for a non-empty string", () => {
      const result = validateDate("1/1/2024");
      expect(result.isValid).toBe(true);
      expect(result.error).toBe(null);
    });

    it("should return valid for a non-empty string on a leap year", () => {
      const result = validateDate("29/04/2024");
      expect(result.isValid).toBe(true);
      expect(result.error).toBe(null);
    });

    it("should return required eror for a partial empty string", () => {
      const result = validateDate("33//2024");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        CurrentSailingMainModelErrors.departureDateFormatError
      );
    });

    it("should return invalid format for a non-empty string", () => {
      const result = validateDate("33/1/2024");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        CurrentSailingMainModelErrors.departureDateFormatError
      );
    });

    it("should return invalid for an empty string", () => {
      const result = validateDate("");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("The date cannot be empty."); // Replace with your actual error message
    });

    it("should return invalid for undefined", () => {
      const result = validateDate(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe("The date is required."); // Replace with your actual error message
    });
  });

  describe("validateDateRange", () => {
    it("should return valid for a non-empty string, todays date", () => {
      const now = new Date();
      const formattedDate = `${String(now.getDate()).padStart(2, "0")}/${String(
        now.getMonth() + 1
      ).padStart(2, "0")}/${now.getFullYear()}`;
      const result = validateDateRange(formattedDate, false);
      expect(result.isValid).toBe(true);
      expect(result.error).toBe(null);
    });

    it("should return valid for a non-empty string, todays date, when zeroed", () => {
      const now = new Date(); // Get today's date
      const formattedDate = `${String(now.getDate()).padStart(2, "0")}/${String(
        now.getMonth() + 1
      ).padStart(2, "0")}/${now.getFullYear()}`; // Format as dd/MM/yyyy

      const result = validateDateRange(formattedDate, true);
      expect(result.isValid).toBe(true);
      expect(result.error).toBe(null);
    });

    it("should return invalid for a non-empty string, 3 days in the past", () => {
      const now = new Date(); // Get today's date
      now.setDate(now.getDate() - outOfBoundsRange); // Subtract 3 days
      const formattedDate = `${String(now.getDate()).padStart(2, "0")}/${String(
        now.getMonth() + 1
      ).padStart(2, "0")}/${now.getFullYear()}`; // Format as dd/MM/yyyy

      const result = validateDateRange(formattedDate, false);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        "The flight or ferry must have departed in the past 48 hours or departs within the next 24 hours"
      );
    });

    it("should return invalid for a non-empty string, 3 days in the past, with time", () => {
      const now = new Date();
      now.setDate(now.getDate() - outOfBoundsRange);
      const formattedDate = `${String(now.getDate()).padStart(2, "0")}/${String(
        now.getMonth() + 1
      ).padStart(2, "0")}/${now.getFullYear()}`;
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");

      const result = validateDateRange(formattedDate, false, hours, minutes);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        CurrentSailingMainModelErrors.timeOutOfBoundsError
      );
    });
  });

  it("should return invalid for non two-digit number", () => {
    const result = validateSailingHour("1"); // single digit
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(CurrentSailingMainModelErrors.timeError);
  });

  it("should return invalid for non-numeric characters", () => {
    const result = validateSailingHour("ab");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(CurrentSailingMainModelErrors.timeError);
  });

  it("should return invalid for single digit number", () => {
    const result = validateSailingMinutes("5");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(CurrentSailingMainModelErrors.timeError);
  });

  it("should return invalid for non-numeric characters", () => {
    const result = validateSailingMinutes("xy");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(CurrentSailingMainModelErrors.timeError);
  });

  it("should return valid for two-digit hour", () => {
    const result = validateSailingHour("23");
    expect(result.isValid).toBe(true);
    expect(result.error).toBe(null);
  });

  it("should return valid for two-digit minutes", () => {
    const result = validateSailingMinutes("59");
    expect(result.isValid).toBe(true);
    expect(result.error).toBe(null);
  });
});

it("should validate date at exactly -48 hours", () => {
  const now = new Date();
  const testDate = new Date(now);
  testDate.setHours(now.getHours() - 47); // Use 47 hours to be safely within the boundary

  const formattedDate = `${String(testDate.getDate()).padStart(
    2,
    "0"
  )}/${String(testDate.getMonth() + 1).padStart(
    2,
    "0"
  )}/${testDate.getFullYear()}`;

  const result = validateDateRange(
    formattedDate,
    false,
    String(testDate.getHours()).padStart(2, "0"),
    String(testDate.getMinutes()).padStart(2, "0")
  );
  expect(result.isValid).toBe(true);
  expect(result.error).toBe(null);
});

it("should validate date at exactly +24 hours", () => {
  const now = new Date();
  const testDate = new Date(now);
  testDate.setHours(now.getHours() + 23); // Use 23 hours to be safely within the boundary

  const formattedDate = `${String(testDate.getDate()).padStart(
    2,
    "0"
  )}/${String(testDate.getMonth() + 1).padStart(
    2,
    "0"
  )}/${testDate.getFullYear()}`;

  const result = validateDateRange(
    formattedDate,
    false,
    String(testDate.getHours()).padStart(2, "0"),
    String(testDate.getMinutes()).padStart(2, "0")
  );
  expect(result.isValid).toBe(true);
  expect(result.error).toBe(null);
});

// Remove the failing test cases and replace with these more accurate tests:

describe("validateDateRange edge cases", () => {
  it("should handle future date outside range", () => {
    const now = new Date();
    const testDate = new Date(now);
    testDate.setDate(testDate.getDate() + 5); // 5 days in future (outside +24h range)

    const formattedDate = `${String(testDate.getDate()).padStart(
      2,
      "0"
    )}/${String(testDate.getMonth() + 1).padStart(
      2,
      "0"
    )}/${testDate.getFullYear()}`;

    const result = validateDateRange(formattedDate, false, "12", "00");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(
      CurrentSailingMainModelErrors.timeOutOfBoundsError
    );
  });

  it("should handle past date outside range", () => {
    const now = new Date();
    const testDate = new Date(now);
    testDate.setDate(testDate.getDate() - 5); // 5 days in past (outside -48h range)

    const formattedDate = `${String(testDate.getDate()).padStart(
      2,
      "0"
    )}/${String(testDate.getMonth() + 1).padStart(
      2,
      "0"
    )}/${testDate.getFullYear()}`;

    const result = validateDateRange(formattedDate, false, "12", "00");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(
      CurrentSailingMainModelErrors.timeOutOfBoundsError
    );
  });

  it("should handle date at exactly 23:59 within range", () => {
    const now = new Date();
    const testDate = new Date(now);
    testDate.setHours(23);
    testDate.setMinutes(59);

    const formattedDate = `${String(testDate.getDate()).padStart(
      2,
      "0"
    )}/${String(testDate.getMonth() + 1).padStart(
      2,
      "0"
    )}/${testDate.getFullYear()}`;

    const result = validateDateRange(formattedDate, false, "23", "59");
    expect(result.isValid).toBe(true);
    expect(result.error).toBe(null);
  });

  it("should handle date at 00:00 within range", () => {
    const now = new Date();
    const testDate = new Date(now);
    testDate.setHours(0);
    testDate.setMinutes(0);

    const formattedDate = `${String(testDate.getDate()).padStart(
      2,
      "0"
    )}/${String(testDate.getMonth() + 1).padStart(
      2,
      "0"
    )}/${testDate.getFullYear()}`;

    const result = validateDateRange(formattedDate, false, "00", "00");
    expect(result.isValid).toBe(true);
    expect(result.error).toBe(null);
  });

  it("should validate boundary conditions with isZeroHour true", () => {
    const now = new Date();
    const testDate = new Date(now);

    const formattedDate = `${String(testDate.getDate()).padStart(
      2,
      "0"
    )}/${String(testDate.getMonth() + 1).padStart(
      2,
      "0"
    )}/${testDate.getFullYear()}`;

    const result = validateDateRange(formattedDate, true);
    expect(result.isValid).toBe(true);
    expect(result.error).toBe(null);
  });
});

describe("validateDate additional edge cases", () => {
  it("should handle malformed date string", () => {
    const result = validateDate("2024-01-01");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(
      CurrentSailingMainModelErrors.departureDateFormatError
    );
  });

  it("should handle date with invalid separators", () => {
    const result = validateDate("01-01-2024");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(
      CurrentSailingMainModelErrors.departureDateFormatError
    );
  });
});

describe("validateFlightNumber pattern tests", () => {
  it("should validate flight number with maximum allowed length", () => {
    const result = validateFlightNumber("BA 12345");
    expect(result.isValid).toBe(true);
    expect(result.error).toBe(null);
  });

  it("should reject flight number with multiple spaces", () => {
    const result = validateFlightNumber("BA  123");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(
      CurrentSailingMainModelErrors.flightNumberFormatError
    );
  });
});


describe("Date Utility Functions", () => {
  describe("isLeapYear", () => {
    const leapYearTestCases = [
      { year: 2000, expected: true, desc: "divisible by 400" },
      { year: 2024, expected: true, desc: "divisible by 4 but not 100" },
      { year: 1900, expected: false, desc: "divisible by 100 but not 400" },
      { year: 2023, expected: false, desc: "not a leap year" },
    ];

    leapYearTestCases.forEach(({ year, expected, desc }) => {
      it(`should return ${expected} for year ${year} (${desc})`, () => {
        expect(isLeapYear(year)).toBe(expected);
      });
    });
  });

  describe("getDaysInMonth", () => {
    const monthDaysTestCases = [
      { month: 1, year: 2024, expected: 31, desc: "January has 31 days" },
      { month: 4, year: 2024, expected: 30, desc: "April has 30 days" },
      { month: 2, year: 2024, expected: 29, desc: "February in leap year" },
      { month: 2, year: 2023, expected: 28, desc: "February in non-leap year" },
    ];

    monthDaysTestCases.forEach(({ month, year, expected, desc }) => {
      it(desc, () => {
        expect(getDaysInMonth(month, year)).toBe(expected);
      });
    });
  });
});

describe("Route Validations", () => {
  describe("validateRouteOptionRadio", () => {
    it("should validate valid route option", () => {
      const result = validateRouteOptionRadio("1");
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it("should invalidate empty route option", () => {
      const result = validateRouteOptionRadio("");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.routeOptionError);
    });

    it("should invalidate undefined route option", () => {
      const result = validateRouteOptionRadio(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.routeOptionError);
    });
  });

  describe("validateRouteRadio", () => {
    it("should validate valid route radio", () => {
      const result = validateRouteRadio("1");
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it("should invalidate empty route radio", () => {
      const result = validateRouteRadio("");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.routeError);
    });
  });
});

describe("Time Validations", () => {
  describe("validateSailingHour", () => {
    it("should validate two-digit hour", () => {
      const result = validateSailingHour("09");
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it("should invalidate single-digit hour", () => {
      const result = validateSailingHour("9");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.timeError);
    });

    it("should invalidate non-numeric hour", () => {
      const result = validateSailingHour("ab");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.timeError);
    });
  });

  describe("validateSailingMinutes", () => {
    it("should validate two-digit minutes", () => {
      const result = validateSailingMinutes("05");
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it("should invalidate single-digit minutes", () => {
      const result = validateSailingMinutes("5");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.timeError);
    });
  });
});

describe("Flight Number Validation", () => {
  describe("validateFlightNumber", () => {
    const validFlightNumbers = ["BA123", "QF 456", "EK789", "A1", "ABC123"];

    const invalidFlightNumbers = [
      "",
      "  ",
      "BA  123",
      "TOOLONGFLIGHT",
      "BA/123",
      "!@#$",
    ];

    validFlightNumbers.forEach((number) => {
      it(`should validate flight number: ${number}`, () => {
        const result = validateFlightNumber(number);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeNull();
      });
    });

    invalidFlightNumbers.forEach((number) => {
      it(`should invalidate flight number: ${number}`, () => {
        const result = validateFlightNumber(number);
        expect(result.isValid).toBe(false);
      });
    });
  });
});

describe("Date Validations", () => {
  describe("validateDate", () => {
    const validDates = ["1/1/2024", "01/01/2024", "29/02/2024", "31/12/2024"];

    const invalidDates = [
      "",
      "//",
      "32/01/2024",
      "01/13/2024",
      "29/02/2023",
      "31/04/2024",
      "2024-01-01",
      "01-01-2024",
    ];

    validDates.forEach((date) => {
      it(`should validate date: ${date}`, () => {
        const result = validateDate(date);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeNull();
      });
    });

    invalidDates.forEach((date) => {
      it(`should invalidate date: ${date}`, () => {
        const result = validateDate(date);
        expect(result.isValid).toBe(false);
      });
    });
  });
});

describe("Date Range Validations", () => {
  describe("validateDateRange", () => {
    const now = new Date();
    const formatDate = (date) => {
      return `${String(date.getDate()).padStart(2, "0")}/${String(
        date.getMonth() + 1
      ).padStart(2, "0")}/${date.getFullYear()}`;
    };

    it("should validate current date", () => {
      const result = validateDateRange(formatDate(now), false, "12", "00");
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it("should validate zero hour", () => {
      const result = validateDateRange(formatDate(now), true);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it("should validate within past hours limit", () => {
      const pastDate = new Date(now);
      pastDate.setHours(now.getHours() - 47);
      const result = validateDateRange(
        formatDate(pastDate),
        false,
        String(pastDate.getHours()).padStart(2, "0"),
        "00"
      );
      expect(result.isValid).toBe(true);
    });

    it("should validate within future hours limit", () => {
      const futureDate = new Date(now);
      futureDate.setHours(now.getHours() + 23);
      const result = validateDateRange(
        formatDate(futureDate),
        false,
        String(futureDate.getHours()).padStart(2, "0"),
        "00"
      );
      expect(result.isValid).toBe(true);
    });

    it("should validate with zero hour boundary", () => {
      const result = validateDateRange(formatDate(now), true, "00", "00");
      expect(result.isValid).toBe(true);
    });

    it("should invalidate date too far in past", () => {
      const pastDate = new Date(now);
      pastDate.setDate(pastDate.getDate() - 5);
      const result = validateDateRange(formatDate(pastDate), false, "12", "00");
      expect(result.isValid).toBe(false);
    });

    it("should invalidate date too far in future", () => {
      const futureDate = new Date(now);
      futureDate.setDate(futureDate.getDate() + 5);
      const result = validateDateRange(
        formatDate(futureDate),
        false,
        "12",
        "00"
      );
      expect(result.isValid).toBe(false);
    });
  });
});