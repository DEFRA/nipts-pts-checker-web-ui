import errorMessages from "../../../../../web/component/checker/documentsearch/errorMessages.js";


describe("errorMessages", () => {
  test("should contain the correct error messages for PTD number", () => {
    expect(errorMessages.ptdNumber).toEqual({
      empty: "Enter a PTD number",
      length: "Enter 6 characters after 'GB826'",
      invalid:
        "Enter 6 characters after 'GB826', using only the letters A to F and numbers",
    });
  });

  test("should contain the correct error messages for application number", () => {
    expect(errorMessages.applicationNumber).toEqual({
      empty: "Enter an application number",
      length: "Enter 8 characters",
      invalid: "Enter 8 characters, using only letters and numbers",
    });
  });

  test("should contain the correct error messages for microchip number", () => {
    expect(errorMessages.microchipNumber).toEqual({
      empty: "Enter a microchip number",
      length: "Enter a 15-digit number",
      invalid: "Enter a 15-digit number, using only numbers",
    });
  });
});
