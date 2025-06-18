import errorMessages from "../../../../../web/component/checker/documentsearch/errorMessages.js";


describe("errorMessages", () => {
  test("should contain the correct error messages for PTD number", () => {
    expect(errorMessages.ptdNumber).toEqual({
      empty: "Enter a PTD number",
    length: "Enter 6 characters after 'GB826', using only letters A-F and numbers, for example AF4399",
    invalid:
      "Enter 6 characters after 'GB826', using only letters A-F and numbers, for example AF4399",
    });
  });

  test("should contain the correct error messages for application number", () => {
    expect(errorMessages.applicationNumber).toEqual({
      empty: "Enter an application number",
      length: "Enter 8 characters using letters and numbers, for example MOG2TXF7",
      invalid: "Enter 8 characters using letters and numbers, for example MOG2TXF7",
    });
  });

  test("should contain the correct error messages for microchip number", () => {
    expect(errorMessages.microchipNumber).toEqual({
      empty: "Enter a microchip number",
      length: "Enter a 15-digit number, using only numbers",
      invalid: "Enter a 15-digit number, using only numbers",
    });
  });
});
