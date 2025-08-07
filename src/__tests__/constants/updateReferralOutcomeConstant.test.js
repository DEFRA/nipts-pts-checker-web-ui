import { UpdateReferralErrors } from "../../constants/updateReferralOutcomeConstant.js";
const errorKeyLength = 3;

describe("UpdateReferralErrors", () => {
  it("should contain the correct error messages", () => {
    expect(UpdateReferralErrors.outcomeOptionError).toEqual(
      "Select if the person is allowed or not allowed to travel under the Windsor Framework"
    );
    expect(UpdateReferralErrors.outcomeTextError).toEqual(
      "Enter the reason you selected that outcome"
    );
    expect(UpdateReferralErrors.outcomeTextLengthError).toEqual(
      "Outcome summary must be 500 characters or less"
    );
  });

  it("should have exactly three error keys", () => {
    expect(Object.keys(UpdateReferralErrors)).toHaveLength(errorKeyLength);
  });
});
