import errorMessages from "../../../../../web/component/checker/noncompliance/errorMessages.js";
const errorMessage = "Enter the 15-digit microchip number, using only numbers";
describe("errorMessages", () => {
  test("should contain the correct error messages for microchipNumber", () => {
    expect(errorMessages.microchipNumber).toEqual({
      empty: "Enter the 15-digit microchip number",
      incorrectFormat:
        "Enter your pet's microchip number in the correct format",
      length: errorMessage,
      letters: errorMessage,
      specialCharacters: errorMessage,
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

});
