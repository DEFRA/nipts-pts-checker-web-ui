import { validatePtdNumber, validateMicrochipNumber } from "../../../../../web/component/checker/documentsearch/validate";

describe("validatePtdNumber", () => {
  test("should return valid for a correct PTD number", () => {
    const result = validatePtdNumber("A1B2C3");
    expect(result).toEqual({
      isValid: true,
      error: null,
    });
  });

  test("should return error for an empty PTD number", () => {
    const result = validatePtdNumber("");
    expect(result).toEqual({
      isValid: false,
      error: "Enter a PTD number",
    });
  });

  test("should return error for a PTD number with less than 6 characters", () => {
    const result = validatePtdNumber("A1B2");
    expect(result).toEqual({
      isValid: false,
      error: "Enter 6 characters after 'GB826'",
    });
  });

  test("should return error for a PTD number with more than 6 characters", () => {
    const result = validatePtdNumber("A1B2C3D4");
    expect(result).toEqual({
      isValid: false,
      error: "Enter 6 characters after 'GB826'",
    });
  });

  test("should return error for a PTD number with invalid characters", () => {
    const result = validatePtdNumber("A1B2GZ");
    expect(result).toEqual({
      isValid: false,
      error: "Enter 6 characters after 'GB826', using only letters and numbers",
    });
  });
});

describe("validateMicrochipNumber", () => {
  test("should return valid for a correct microchip number", () => {
    const result = validateMicrochipNumber("123456789012345");
    expect(result).toEqual({
      isValid: true,
      error: null,
    });
  });

  test("should return error for an empty microchip number", () => {
    const result = validateMicrochipNumber("");
    expect(result).toEqual({
      isValid: false,
      error: "Enter a microchip number",
    });
  });

  test("should return error for a microchip number with less than 15 digits", () => {
    const result = validateMicrochipNumber("12345678901234");
    expect(result).toEqual({
      isValid: false,
      error: "Enter a 15-digit number",
    });
  });

  test("should return error for a microchip number with more than 15 digits", () => {
    const result = validateMicrochipNumber("1234567890123456");
    expect(result).toEqual({
      isValid: false,
      error: "Enter a 15-digit number",
    });
  });

  test("should return error for a microchip number with non-digit characters", () => {
    const result = validateMicrochipNumber("12345678901234A");
    expect(result).toEqual({
      isValid: false,
      error: "Enter a 15-digit number",
    });
  });
});
