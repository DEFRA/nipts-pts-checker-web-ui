import errorMessages from "../../../../../web/component/checker/noncompliance/errorMessage.js";

describe("errorMessages", () => {
  test("should contain the correct error messages for microchipNumber", () => {
    expect(errorMessages.microchipNumber).toEqual({
      empty: "Enter a microchip number",
      incorrectFormat:
        "Enter your pet's microchip number in the correct format",
      length: "Enter your pet's 15-digit microchip number",
      letters: "Enter a 15-digit number, using only numbers",
      specialCharacters:
        "Enter your pet's 15-digit microchip number - do not use spaces or special characters like hyphens or dashes",
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
      empty: "Select a type of passenger",
    });
  });

});
