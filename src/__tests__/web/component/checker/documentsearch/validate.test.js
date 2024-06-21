import {
  validatePtdNumber,
  validateApplicationNumber,
  validateMicrochipNumber,
} from "../../../../../web/component/checker/documentsearch/validate";
import errorMessages from "../../../../../web/component/checker/documentsearch/errorMessage";

describe("Validation Functions", () => {
  describe("PTD Number Validation", () => {
    test("should validate a correct PTD number", () => {
      const result = validatePtdNumber("A2B3C4");
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test("should return error for empty PTD number", () => {
      const result = validatePtdNumber("");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(errorMessages.ptdNumber.empty);
    });

    test("should return error for PTD number not 6 characters long", () => {
      const result = validatePtdNumber("12345");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(errorMessages.ptdNumber.length);
    });


  });

  describe("Application Number Validation", () => {
    test("should validate a correct application number", () => {
      const result = validateApplicationNumber("APP12345");
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test("should return error for empty application number", () => {
      const result = validateApplicationNumber("");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(errorMessages.applicationNumber.empty);
    });

    test("should return error for application number not 8 characters long", () => {
      const result = validateApplicationNumber("APP1234");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(errorMessages.applicationNumber.length);
    });

    test("should return error for application number with invalid characters", () => {
      const result = validateApplicationNumber("APP1234!");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(errorMessages.applicationNumber.invalid);
    });
  });

  describe("Microchip Number Validation", () => {
    test("should validate a correct microchip number", () => {
      const result = validateMicrochipNumber("123456789012345");
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test("should return error for empty microchip number", () => {
      const result = validateMicrochipNumber("");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(errorMessages.microchipNumber.empty);
    });

    test("should return error for microchip number not 15 digits long", () => {
      const result = validateMicrochipNumber("12345678901234");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(errorMessages.microchipNumber.invalid);
    });

    test("should return error for microchip number with invalid characters", () => {
      const result = validateMicrochipNumber("12345678901234A");
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(errorMessages.microchipNumber.invalid);
    });
  });
});
