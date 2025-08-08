import {
  validateOutcomeRadio,
  validateOutcomeReason
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
