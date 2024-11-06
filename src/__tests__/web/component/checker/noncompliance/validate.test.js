import { validateNonCompliance } from "../../../../../web/component/checker/noncompliance/validate";
import errorMessages from "../../../../../web/component/checker/noncompliance/errorMessages.js";

describe("Validation Functions", () => {
  describe("NonCompliance Validation", () => {
    test("should validate when microchipNumberRadio is not 'on'", () => {
      const payload = {
        microchipNumberRadio: "off",
        ptdProblem: "someProblem",
        passengerType: "foot"
      };
      const result = validateNonCompliance(payload);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test("should validate when microchipNumberRadio is 'on' and microchipNumber is valid", () => {
      const payload = {
        microchipNumberRadio: "on",
        microchipNumber: "123456789012345",
        ptdProblem: "someProblem",
        passengerType: "foot"
      };
      const result = validateNonCompliance(payload);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test("should return error when microchipNumber is empty", () => {
      const payload = {
        mcNotMatch: "true",
        mcNotMatchActual: "",
        ptdProblem: "someProblem",
        passengerType: "foot"
      };
      const result = validateNonCompliance(payload);
      expect(result.isValid).toBe(false);
      expect(result.errors).toEqual([
        {
          message: errorMessages.microchipNumber.empty,
          path: ["mcNotMatchActual"],
        },
      ]);
    });

    test("should return error when microchipNumber contains letters", () => {
      const payload = {
        mcNotMatch: "true",
        mcNotMatchActual: "12345678901234A",
        ptdProblem: "someProblem",
        passengerType: "foot"
      };
      const result = validateNonCompliance(payload);
      expect(result.isValid).toBe(false);
      expect(result.errors).toEqual([
        {
          message: errorMessages.microchipNumber.letters,
          path: ["mcNotMatchActual"],
        },
      ]);
    });

    test("should return error when microchipNumber contains special characters", () => {
      const payload = {
        mcNotMatch: "true",
        mcNotMatchActual: "12345678901234!",
        ptdProblem: "someProblem",
        passengerType: "foot"
      };
      const result = validateNonCompliance(payload);
      expect(result.isValid).toBe(false);
      expect(result.errors).toEqual([
        {
          message: errorMessages.microchipNumber.specialCharacters,
          path: ["mcNotMatchActual"],
        },
      ]);
    });

    test("should return error when microchipNumber is not 15 digits", () => {
      const payload = {
        mcNotMatch: "true",
        mcNotMatchActual: "12345678901234",
        ptdProblem: "someProblem",
        passengerType: "foot"
      };
      const result = validateNonCompliance(payload);
      expect(result.isValid).toBe(false);
      expect(result.errors).toEqual([
        {
          message: errorMessages.microchipNumber.length,
          path: ["mcNotMatchActual"],
        },
      ]);
    });
  });
});
