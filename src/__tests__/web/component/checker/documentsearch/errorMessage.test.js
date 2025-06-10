import errorMessages from "../../../../../web/component/checker/documentsearch/errorMessages.js";


describe("errorMessages", () => {
  test("should contain the correct error messages for PTD number", () => {
    expect(errorMessages.ptdNumber).toEqual({
      empty: "Enter a PTD number",
      length: "PTD number must contain 6 characters after 'GB826'",
      invalid:
        "PTD number must contain 6 characters after 'GB826', using only letters A to F and numbers",
    });
  });

  test("should contain the correct error messages for application number", () => {
    expect(errorMessages.applicationNumber).toEqual({
      empty: "Enter an application number",
      length: "Application Number must be 8 characters long",
      invalid: "Application Number must be 8 characters long, using only letters and numbers",
    });
  });

  test("should contain the correct error messages for microchip number", () => {
    expect(errorMessages.microchipNumber).toEqual({
      empty: "Enter a microchip number",
      length: "Microchip Number must be 15 digits long",
      invalid: "Microchip Number must be 15 digits long, using only numbers 0 to 9",
    });
  });
});
