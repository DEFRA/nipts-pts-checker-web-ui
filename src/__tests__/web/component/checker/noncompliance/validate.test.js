import { validateNonCompliance } from "../../../../../web/component/checker/noncompliance/validate";
import errorMessages from "../../../../../web/component/checker/noncompliance/errorMessages.js";

describe("NonCompliance Validation isGbCheck is True", () => {
  test("should validate required fields when nothing is selected on UI", () => {
      const payload = {
        mcNotMatchActual: "",
        relevantComments: "",
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
      mcNotMatchActual: "",
      relevantComments: "",
      spsOutcomeDetails: "",
      isGBCheck: true,
      spsOutcome: "true",
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
        "message": errorMessages.spsOutcome.incorrectSelection,
        "path": ["spsOutcome"]
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
      mcNotMatchActual: "",
      relevantComments: "",
      spsOutcomeDetails: "",
      isGBCheck: true,
      vcNotMatchPTD: "true",
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
      mcNotMatchActual: "",
      relevantComments: "",
      spsOutcomeDetails: "",
      isGBCheck: true,
      vcNotMatchPTD: "true",
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
      mcNotMatchActual: "",
      relevantComments: "",
      spsOutcomeDetails: "",
      isGBCheck: true,
      vcNotMatchPTD: "true",
      passengerType: "2",
      gbRefersToDAERAOrSPS: "true"
    };

    const expectedErrorrs = []

    const result = validateNonCompliance(payload);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual(expectedErrorrs);
  });

  test("should validate required fields when mcNotMatch is selected as reason and no mcNotMatchActual entered on UI", () => {
    const payload = {
      mcNotMatch: "true",
      mcNotMatchActual: "",
      relevantComments: "",
      spsOutcomeDetails: "",
      isGBCheck: true,
      vcNotMatchPTD: "true",
    };

    const expectedErrorrs = [
      {
        "message": errorMessages.microchipNumber.empty,
        "path": ["mcNotMatchActual"]
      },
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

  test("should validate required fields when mcNotMatch is selected as reason and mcNotMatchActual entered containes letters on UI", () => {
    const payload = {
      mcNotMatch: "true",
      mcNotMatchActual: "12345678901234A",
      relevantComments: "",
      spsOutcomeDetails: "",
      isGBCheck: true,
      vcNotMatchPTD: "true",
    };

    const expectedErrorrs = [
      {
        "message": errorMessages.microchipNumber.letters,
        "path": ["mcNotMatchActual"]
      },
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
  

  test("should validate required fields when mcNotMatch is selected as reason and mcNotMatchActual entered containes special characters on UI", () => {
    const payload = {
      mcNotMatch: "true",
      mcNotMatchActual: "12345678901234!",
      relevantComments: "",
      spsOutcomeDetails: "",
      isGBCheck: true,
      vcNotMatchPTD: "true",
    };

    const expectedErrorrs = [
      {
        "message": errorMessages.microchipNumber.specialCharacters,
        "path": ["mcNotMatchActual"]
      },
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


  test("should validate required fields when mcNotMatch is selected as reason and mcNotMatchActual entered containes incorrect length on UI", () => {
    const payload = {
      mcNotMatch: "true",
      mcNotMatchActual: "12345678901234",
      relevantComments: "",
      spsOutcomeDetails: "",
      isGBCheck: true,
      vcNotMatchPTD: "true",
    };

    const expectedErrorrs = [
      {
        "message": errorMessages.microchipNumber.length,
        "path": ["mcNotMatchActual"]
      },
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

  test("should validate required fields when mcNotMatch is selected as reason and valid mcNotMatchActual entered on UI", () => {
    const payload = {
      mcNotMatch: "true",
      mcNotMatchActual: "123456789012345",
      relevantComments: "",
      spsOutcomeDetails: "",
      isGBCheck: true,
      vcNotMatchPTD: "true",
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
});


describe("NonCompliance Validation isGbCheck is False", () => {
  test("should validate required fields when nothing is selected on UI", () => {
      const payload = {
        mcNotMatchActual: "",
        relevantComments: "",
        spsOutcomeDetails: "",
        isGBCheck: false,
      };

      const expectedErrorrs = [
        {
          "message": errorMessages.passengerType.empty,
          "path": ["passengerType"],
        },
        {
          "message": errorMessages.spsOutcome.required,
          "path": ["spsOutcome"]
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
      mcNotMatchActual: "",
      relevantComments: "",
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
        "message": errorMessages.spsOutcome.required,
        "path": ["spsOutcome"]
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
      mcNotMatchActual: "",
      relevantComments: "",
      spsOutcomeDetails: "",
      isGBCheck: false,
      vcNotMatchPTD: "true",
    };

    const expectedErrorrs = [
      {
        "message": errorMessages.passengerType.empty,
        "path": ["passengerType"],
      },
      {
        "message": errorMessages.spsOutcome.required,
        "path": ["spsOutcome"]
      },
   ]

    const result = validateNonCompliance(payload);
    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(expectedErrorrs);
  });


  test("should validate required fields when noncompliance reason and passenger type selected on UI", () => {
    const payload = {
      mcNotMatchActual: "",
      relevantComments: "",
      spsOutcomeDetails: "",
      isGBCheck: false,
      vcNotMatchPTD: "true",
      passengerType: "2"
    };

    const expectedErrorrs = [
      {
        "message": errorMessages.spsOutcome.required,
        "path": ["spsOutcome"]
      },
  ]

    const result = validateNonCompliance(payload);
    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(expectedErrorrs);
  });

  test("should validate required fields when all required fileds are selected on UI", () => {
    const payload = {
      mcNotMatchActual: "",
      relevantComments: "",
      spsOutcomeDetails: "",
      isGBCheck: false,
      vcNotMatchPTD: "true",
      passengerType: "2",
      spsOutcome: "true"
    };

    const expectedErrorrs = []

    const result = validateNonCompliance(payload);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual(expectedErrorrs);
  });

  test("should validate required fields when mcNotMatch is selected as reason and no mcNotMatchActual entered on UI", () => {
    const payload = {
      mcNotMatch: "true",
      mcNotMatchActual: "",
      relevantComments: "",
      spsOutcomeDetails: "",
      isGBCheck: false,
      vcNotMatchPTD: "true",
    };

    const expectedErrorrs = [
      {
        "message": errorMessages.microchipNumber.empty,
        "path": ["mcNotMatchActual"]
      },
      {
        "message": errorMessages.passengerType.empty,
        "path": ["passengerType"],
      },
      {
        "message": errorMessages.spsOutcome.required,
        "path": ["spsOutcome"]
      },
   ]

    const result = validateNonCompliance(payload);
    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(expectedErrorrs);
  });

  test("should validate required fields when mcNotMatch is selected as reason and mcNotMatchActual entered containes letters on UI", () => {
    const payload = {
      mcNotMatch: "true",
      mcNotMatchActual: "12345678901234A",
      relevantComments: "",
      spsOutcomeDetails: "",
      isGBCheck: false,
      vcNotMatchPTD: "true",
    };

    const expectedErrorrs = [
      {
        "message": errorMessages.microchipNumber.letters,
        "path": ["mcNotMatchActual"]
      },
      {
        "message": errorMessages.passengerType.empty,
        "path": ["passengerType"],
      },
      {
        "message": errorMessages.spsOutcome.required,
        "path": ["spsOutcome"]
      },
   ]

    const result = validateNonCompliance(payload);
    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(expectedErrorrs);
  });
  

  test("should validate required fields when mcNotMatch is selected as reason and mcNotMatchActual entered containes special characters on UI", () => {
    const payload = {
      mcNotMatch: "true",
      mcNotMatchActual: "12345678901234!",
      relevantComments: "",
      spsOutcomeDetails: "",
      isGBCheck: false,
      vcNotMatchPTD: "true",
    };

    const expectedErrorrs = [
      {
        "message": errorMessages.microchipNumber.specialCharacters,
        "path": ["mcNotMatchActual"]
      },
      {
        "message": errorMessages.passengerType.empty,
        "path": ["passengerType"],
      },
      {
        "message": errorMessages.spsOutcome.required,
        "path": ["spsOutcome"]
      },
   ]

    const result = validateNonCompliance(payload);
    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(expectedErrorrs);
  });

  test("should validate required fields when mcNotMatch is selected as reason and mcNotMatchActual entered containes incorrect length on UI", () => {
    const payload = {
      mcNotMatch: "true",
      mcNotMatchActual: "12345678901234",
      relevantComments: "",
      spsOutcomeDetails: "",
      isGBCheck: false,
      vcNotMatchPTD: "true",
    };

    const expectedErrorrs = [
      {
        "message": errorMessages.microchipNumber.length,
        "path": ["mcNotMatchActual"]
      },
      {
        "message": errorMessages.passengerType.empty,
        "path": ["passengerType"],
      },
      {
        "message": errorMessages.spsOutcome.required,
        "path": ["spsOutcome"]
      },
   ]

    const result = validateNonCompliance(payload);
    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(expectedErrorrs);
  });

  test("should validate required fields when mcNotMatch is selected as reason and valid mcNotMatchActual entered on UI", () => {
    const payload = {
      mcNotMatch: "true",
      mcNotMatchActual: "123456789012345",
      relevantComments: "",
      spsOutcomeDetails: "",
      isGBCheck: false,
      vcNotMatchPTD: "true",
    };

    const expectedErrorrs = [
      {
        "message": errorMessages.passengerType.empty,
        "path": ["passengerType"],
      },
      {
        "message": errorMessages.spsOutcome.required,
        "path": ["spsOutcome"]
      },
   ]

    const result = validateNonCompliance(payload);
    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(expectedErrorrs);
  });

  test("should return error message when mcNotMatchActual is empty", () => {
    const payload = {
      mcNotMatch: "true",
      mcNotMatchActual: "",
      relevantComments: "",
      spsOutcomeDetails: "",
      isGBCheck: false,
      vcNotMatchPTD: "true"
    };
  
    const expectedErrors = [
      {
        "message": errorMessages.microchipNumber.empty,
        "path": ["mcNotMatchActual"]
      },
      {
        "message": errorMessages.passengerType.empty,
        "path": ["passengerType"],
      },
      {
        "message": errorMessages.spsOutcome.required,
        "path": ["spsOutcome"]
      },
    ];
  
    const result = validateNonCompliance(payload);
    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(expectedErrors);
  });
  
  test("should return error message when mcNotMatchActual contains special characters", () => {
    const payload = {
      mcNotMatch: "true",
      mcNotMatchActual: "1234 5678 9012 345",
      relevantComments: "",
      spsOutcomeDetails: "",
      isGBCheck: false,
      vcNotMatchPTD: "true",
    };
  
    const expectedErrors = [
      {
        "message": errorMessages.microchipNumber.specialCharacters,
        "path": ["mcNotMatchActual"]
      },
      {
        "message": errorMessages.passengerType.empty,
        "path": ["passengerType"],
      },
      {
        "message": errorMessages.spsOutcome.required,
        "path": ["spsOutcome"]
      },
    ];
  
    const result = validateNonCompliance(payload);
    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(expectedErrors);
  });
  
  test("should return error message when mcNotMatchActual contains letters", () => {
    const payload = {
      mcNotMatch: "true",
      mcNotMatchActual: "12345ABC789012345",
      relevantComments: "",
      spsOutcomeDetails: "",
      isGBCheck: false,
      vcNotMatchPTD: "true",
    };
  
    const expectedErrors = [
      {
        "message": errorMessages.microchipNumber.specialCharacters,
        "path": ["mcNotMatchActual"]
      },
      {
        "message": errorMessages.passengerType.empty,
        "path": ["passengerType"],
      },
      {
        "message": errorMessages.spsOutcome.required,
        "path": ["spsOutcome"]
      },
    ];
  
    const result = validateNonCompliance(payload);
    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(expectedErrors);
  });
  
  test("should return error message when mcNotMatchActual length is incorrect", () => {
    const payload = {
      mcNotMatch: "true",
      mcNotMatchActual: "12345",
      relevantComments: "",
      spsOutcomeDetails: "",
      isGBCheck: false,
      vcNotMatchPTD: "true",
    };
  
    const expectedErrors = [
      {
        "message": errorMessages.microchipNumber.length,
        "path": ["mcNotMatchActual"]
      },
      {
        "message": errorMessages.passengerType.empty,
        "path": ["passengerType"],
      },
      {
        "message": errorMessages.spsOutcome.required,
        "path": ["spsOutcome"]
      },
    ];
  
    const result = validateNonCompliance(payload);
    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(expectedErrors);
  });
});