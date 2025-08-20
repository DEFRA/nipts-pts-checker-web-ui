import { validatePassOrFail } from "../../../../../web/component/checker/searchresults/validate";
import errorMessages from "../../../../../web/component/checker/searchresults/errorMessages";

describe("validatePassOrFail", () => {
  it("should return valid for Pass string", () => {
    const result = validatePassOrFail("Pass");
    expect(result.isValid).toBe(true);
    expect(result.error).toBe(null);
  });

  it("should return valid for Fail string", () => {
    const result = validatePassOrFail("Fail");
    expect(result.isValid).toBe(true);
    expect(result.error).toBe(null);
  });

  it("should return invalid for any other string value", () => {
    const result = validatePassOrFail("SomeValidString");
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for numeric string", () => {
    const result = validatePassOrFail("123");
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for special characters string", () => {
    const result = validatePassOrFail("!@#$%^&*()");
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for string with spaces", () => {
    const result = validatePassOrFail("Pass with spaces");
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for very long string", () => {
    const longString = "a".repeat(1000);
    const result = validatePassOrFail(longString);
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for an empty string", () => {
    const result = validatePassOrFail("");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Please select a valid option");
  });

  it("should return invalid for undefined", () => {
    const result = validatePassOrFail(undefined);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(errorMessages.passOrFailOption.empty);
  });

  it("should return invalid for null", () => {
    const result = validatePassOrFail(null);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(errorMessages.passOrFailOption.empty);
  });

  it("should return invalid for number value", () => {
    const result = validatePassOrFail(123);
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for boolean true", () => {
    const result = validatePassOrFail(true);
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for boolean false", () => {
    const result = validatePassOrFail(false);
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for object", () => {
    const result = validatePassOrFail({});
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for array", () => {
    const result = validatePassOrFail([]);
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for function", () => {
    const result = validatePassOrFail(function () {});
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for arrow function", () => {
    const result = validatePassOrFail(() => {});
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for symbol", () => {
    const result = validatePassOrFail(Symbol("test"));
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for zero", () => {
    const result = validatePassOrFail(0);
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for negative number", () => {
    const result = validatePassOrFail(-1);
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for positive number", () => {
    const result = validatePassOrFail(1);
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for float number", () => {
    const result = validatePassOrFail(1.5);
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for NaN", () => {
    const result = validatePassOrFail(NaN);
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for Infinity", () => {
    const result = validatePassOrFail(Infinity);
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for -Infinity", () => {
    const result = validatePassOrFail(-Infinity);
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for Date object", () => {
    const result = validatePassOrFail(new Date());
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for RegExp object", () => {
    const result = validatePassOrFail(/test/);
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for Error object", () => {
    const result = validatePassOrFail(new Error("test"));
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for string with only whitespace", () => {
    const result = validatePassOrFail("   ");
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for string with tabs", () => {
    const result = validatePassOrFail("\t\t\t");
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for string with newlines", () => {
    const result = validatePassOrFail("\n\n\n");
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for string with mixed whitespace", () => {
    const result = validatePassOrFail(" \t\n ");
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for unicode string", () => {
    const result = validatePassOrFail("🎉✅❌");
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for escaped string", () => {
    const result = validatePassOrFail("Pass\\nFail");
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should be case sensitive - pass should be invalid", () => {
    const result = validatePassOrFail("pass");
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should be case sensitive - fail should be invalid", () => {
    const result = validatePassOrFail("fail");
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should be case sensitive - PASS should be invalid", () => {
    const result = validatePassOrFail("PASS");
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should be case sensitive - FAIL should be invalid", () => {
    const result = validatePassOrFail("FAIL");
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for Pass with leading space", () => {
    const result = validatePassOrFail(" Pass");
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for Pass with trailing space", () => {
    const result = validatePassOrFail("Pass ");
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for Fail with leading space", () => {
    const result = validatePassOrFail(" Fail");
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should return invalid for Fail with trailing space", () => {
    const result = validatePassOrFail("Fail ");
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it("should consistently return same result for same input", () => {
    const input = "Pass";
    const result1 = validatePassOrFail(input);
    const result2 = validatePassOrFail(input);
    expect(result1.isValid).toBe(result2.isValid);
    expect(result1.error).toBe(result2.error);
  });

  it("should handle multiple consecutive calls correctly", () => {
    const results = [];
    for (let i = 0; i < 5; i++) {
      results.push(validatePassOrFail("Pass"));
    }
    results.forEach((result) => {
      expect(result.isValid).toBe(true);
      expect(result.error).toBe(null);
    });
  });

  it("should handle multiple consecutive invalid calls correctly", () => {
    const results = [];
    for (let i = 0; i < 5; i++) {
      results.push(validatePassOrFail("Invalid"));
    }
    results.forEach((result) => {
      expect(result.isValid).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });
});
