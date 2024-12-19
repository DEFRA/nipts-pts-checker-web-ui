import errorMessages from "../../../../../web/component/checker/noncompliance/errorMessages.js";

const errorMessage = "Enter the 15-digit microchip number, using only numbers";
const spaceErrorMessage =
  "Enter your pet's 15-digit microchip number - do not use spaces or special characters like hyphens or dashes";

describe("errorMessages", () => {
  test("should contain the correct error messages for microchipNumber", () => {
    expect(errorMessages.microchipNumber).toEqual({
      empty: "Enter the 15-digit microchip number",
      incorrectFormat:
        "Enter your pet's microchip number in the correct format",
      length: errorMessage,
      letters: errorMessage,
      specialCharacters: spaceErrorMessage,
      wrongMicrochip:
        "The microchip number is associated with another lifelong pet travel document",
    });
  });

  test("should contain the correct error message for serviceError", () => {
    expect(errorMessages.serviceError).toEqual({
      message: "An unexpected error occurred while processing your request",
    });
  });

  test("should contain the correct error message for no passenger type selected", () => {
    expect(errorMessages.passengerType).toEqual({
      empty: "Select the type of passenger",
    });
  });

  test("should contain the correct error messages for SPS outcome", () => {
    expect(errorMessages.spsOutcome).toEqual({
      incorrectSelection: "You cannot select an SPS outcome",
      required: "Select if travel is allowed or not allowed",
    });
  });

  test("should contain the correct error messages for GB outcome", () => {
    expect(errorMessages.gbOutcome).toEqual({
      incorrectSelection: "You cannot select a GB outcome",
      required: "Select at least one GB outcome",
    });
  });

  test("should contain the correct error message for missing reason", () => {
    expect(errorMessages.missingReason).toEqual({
      empty: "Select at least one reason for non-compliance",
    });
  });

  test("should contain the correct error message for vehicle registration", () => {
    expect(errorMessages.vehicleRegistration).toEqual({
      empty: "Enter a vehicle registration",
    });
  });
});
