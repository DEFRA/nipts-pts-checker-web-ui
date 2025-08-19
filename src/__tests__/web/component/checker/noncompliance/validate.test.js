import { validateNonCompliance } from "../../../../../web/component/checker/noncompliance/validate";
import errorMessages from "../../../../../web/component/checker/noncompliance/errorMessages.js";

describe("NonCompliance Validation isGbCheck is True", () => {
  test("should validate required fields when nothing is selected on UI", () => {
      const payload = {
        spsOutcomeDetails: "",
        isGBCheck: true,
      };

      const expectedErrorrs = [
        {
          "message": errorMessages.passengerType.empty,
          "path": ["passengerType"],
        },
        {
          "message": errorMessages.gbOutcome.required,
          "path": ["isGBCheck"]
        },
        {
          "message": errorMessages.missingReason.empty,
          "path": ["missingReason"]
        },
     ]

    const result = validateNonCompliance(payload);
    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(expectedErrorrs);
  });

  test("should validate required fields when only option slecetd on UI spsOutcome", () => {
    const payload = {
      spsOutcomeDetails: "",
      isGBCheck: true,
    };

    const expectedErrorrs = [
      {
        "message": errorMessages.passengerType.empty,
        "path": ["passengerType"],
      },
      {
        "message": errorMessages.gbOutcome.required,
        "path": ["isGBCheck"]
      },
      {
        "message": errorMessages.missingReason.empty,
        "path": ["missingReason"]
      },
   ]

    const result = validateNonCompliance(payload);
    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(expectedErrorrs);
  });

  test("should validate required fields when noncompliance reason selected on UI", () => {
    const payload = {
      spsOutcomeDetails: "",
      mcNotFound: "true",
      isGBCheck: true,
    };

    const expectedErrorrs = [
      {
        "message": errorMessages.passengerType.empty,
        "path": ["passengerType"],
      },
      {
        "message": errorMessages.gbOutcome.required,
        "path": ["isGBCheck"]
      },
   ]

    const result = validateNonCompliance(payload);
    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(expectedErrorrs);
  });


  test("should validate required fields when noncompliance reason and passenger type selected on UI", () => {
    const payload = {
      spsOutcomeDetails: "",
      mcNotFound: "true",
      isGBCheck: true,
      passengerType: "2"
    };

    const expectedErrorrs = [
      {
        "message": errorMessages.gbOutcome.required,
        "path": ["isGBCheck"]
      },
  ]

    const result = validateNonCompliance(payload);
    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(expectedErrorrs);
  });

  test("should validate required fields when all required fileds are selected on UI", () => {
    const payload = {
      spsOutcomeDetails: "",
      isGBCheck: true,
      passengerType: "2",
      mcNotFound: "true",
      gbRefersToDAERAOrSPS: "true"
    };

    const expectedErrorrs = []

    const result = validateNonCompliance(payload);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual(expectedErrorrs);
  });
});


describe("NonCompliance Validation isGbCheck is False", () => {
  test("should validate required fields when nothing is selected on UI", () => {
      const payload = {
        spsOutcomeDetails: "",
        isGBCheck: false,
      };

      const expectedErrorrs = [
        {
          "message": errorMessages.passengerType.empty,
          "path": ["passengerType"],
        },
        {
          "message": errorMessages.missingReason.empty,
          "path": ["missingReason"]
        },
     ]

    const result = validateNonCompliance(payload);
    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(expectedErrorrs);
  });

  test("should validate required fields when only option slecetd on UI gbOutcome", () => {
    const payload = {
      spsOutcomeDetails: "",
      isGBCheck: false,
      gbRefersToDAERAOrSPS: "true",
    };

    const expectedErrorrs = [
      {
        "message": errorMessages.passengerType.empty,
        "path": ["passengerType"],
      },
      {
        "message": errorMessages.gbOutcome.incorrectSelection,
        "path": ["isGBCheck"]
      },
      {
        "message": errorMessages.missingReason.empty,
        "path": ["missingReason"]
      },
   ]

    const result = validateNonCompliance(payload);
    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(expectedErrorrs);
  });

test("should validate required fields when noncompliance reason selected on UI", () => {
    const payload = {
      spsOutcomeDetails: "",
      mcNotFound: "true",
      isGBCheck: false,
    };

    const expectedErrorrs = [
      {
        "message": errorMessages.passengerType.empty,
        "path": ["passengerType"],
      },
   ]

    const result = validateNonCompliance(payload);
    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(expectedErrorrs);
  });

  test("should validate required fields when all required fileds are selected on UI", () => {
    const payload = {
      spsOutcomeDetails: "",
      isGBCheck: false,
      passengerType: "2",
      mcNotFound: "true",
    };

    const expectedErrorrs = []

    const result = validateNonCompliance(payload);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual(expectedErrorrs);
  });
  
});