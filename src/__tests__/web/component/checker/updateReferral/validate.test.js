import {
  validateOutcomeRadio,
  validateOutcomeReason,
  validateUpdateReferralForm
} from "../../../../../web/component/checker/updateReferral/validate.js";

import { UpdateReferralErrors } from "../../../../../constants/updateReferralOutcomeConstant.js";
const textLimit = 500;
const overTextLimit = 501;


describe("validateOutcomeRadio", () => {
  it("should return valid for 'yes'", () => {
    const result = validateOutcomeRadio("yes");
    expect(result.isValid).toBe(true);
    expect(result.error).toBeNull();
  });

  it("should return valid for 'no'", () => {
    const result = validateOutcomeRadio("no");
    expect(result.isValid).toBe(true);
    expect(result.error).toBeNull();
  });

  it("should return error for empty string", () => {
    const result = validateOutcomeRadio("");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(UpdateReferralErrors.outcomeOptionError);
  });

  it("should return error for undefined", () => {
    const result = validateOutcomeRadio(undefined);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(UpdateReferralErrors.outcomeOptionError);
  });
});

describe("validateOutcomeReason", () => {
  it("should return valid for a short reason", () => {
    const result = validateOutcomeReason("Valid reason for outcome.");
    expect(result.isValid).toBe(true);
    expect(result.error).toBeNull();
  });

  it("should return error for empty string", () => {
    const result = validateOutcomeReason("");
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(UpdateReferralErrors.outcomeTextError);
  });

  it("should return error for undefined", () => {
    const result = validateOutcomeReason(undefined);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(UpdateReferralErrors.outcomeTextError);
  });

  it("should return error for reason exceeding 500 characters", () => {
    const longText = "a".repeat(overTextLimit);
    const result = validateOutcomeReason(longText);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(UpdateReferralErrors.outcomeTextLengthError);
  });

  it("should return valid for reason exactly 500 characters", () => {
    const exactText = "a".repeat(textLimit);
    const result = validateOutcomeReason(exactText);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeNull();
  });
});



describe("validateUpdateReferralForm", () => {
 const ptdFormattedNumber = "GB123 4567 8901";
 const issuedDate = "2025-08-07";
 const status = "Approved";
 const microchipNumber = "123456789012345";
 const petSpecies = "Dog";
 const documentStatusColourMapping = "govuk-tag govuk-tag--green"

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return isValid true when validation passes", () => {
    const validPayload = {
            travelUnderFramework: "yes",
            detailsOfOutcome: "Valid reason",
            PTDNumberFormatted: ptdFormattedNumber,
            issuedDate: issuedDate,
            status: status,
            microchipNumber: microchipNumber,
            petSpecies: petSpecies,
            documentStatusColourMapping: documentStatusColourMapping,
  };

    const result = validateUpdateReferralForm(validPayload);

    expect(result.isValid).toBe(true);
    expect(result.errorSummary).toHaveLength(0);
    expect(result.applicationData).toEqual(expect.objectContaining(validPayload));
  });

  it("should return isValid false when radio validation fails", () => {
    const validPayload = {
              travelUnderFramework: "",
              detailsOfOutcome: "Valid reason",
              PTDNumberFormatted: ptdFormattedNumber,
              issuedDate: issuedDate,
              status: status,
              microchipNumber: microchipNumber,
              petSpecies: petSpecies,
              documentStatusColourMapping: documentStatusColourMapping,
    };

    const result = validateUpdateReferralForm(validPayload);

    expect(result.isValid).toBe(false);
    expect(result.errorSummary).toEqual([
      { fieldId: "outcomeRadio", message: UpdateReferralErrors.outcomeOptionError },
    ]);
    expect(result.validationResultRadioError).toBe(UpdateReferralErrors.outcomeOptionError);
  });

  it("should return isValid false when text validation fails", () => {
    const validPayload = {
              travelUnderFramework: "yes",
              detailsOfOutcome: "",
              PTDNumberFormatted: ptdFormattedNumber,
              issuedDate: issuedDate,
              status: status,
              microchipNumber: microchipNumber,
              petSpecies: petSpecies,
              documentStatusColourMapping: documentStatusColourMapping,
    };

    const result = validateUpdateReferralForm(validPayload);

    expect(result.isValid).toBe(false);
    expect(result.errorSummary).toEqual([
      { fieldId: "detailsOfOutcome", message: UpdateReferralErrors.outcomeTextError },
    ]);
    expect(result.validationResultTextError).toBe(UpdateReferralErrors.outcomeTextError);
  });

  it("should return both errors when both validations fail", () => {
        const validPayload = {
              travelUnderFramework: "",
              detailsOfOutcome: "",
              PTDNumberFormatted: ptdFormattedNumber,
              issuedDate: issuedDate,
              status: status,
              microchipNumber: microchipNumber,
              petSpecies: petSpecies,
              documentStatusColourMapping: documentStatusColourMapping,
    };

    const result = validateUpdateReferralForm(validPayload);

    expect(result.isValid).toBe(false);
    expect(result.errorSummary).toEqual([
      { fieldId: "outcomeRadio", message: UpdateReferralErrors.outcomeOptionError },
      { fieldId: "detailsOfOutcome", message: UpdateReferralErrors.outcomeTextError },
    ]);
  });
});

