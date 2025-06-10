const errorMessages = {
  ptdNumber: {
    empty: "Enter a PTD number",
    length: "PTD number must contain 6 characters after 'GB826'",
    invalid:
      "PTD number must contain 6 characters after 'GB826', using only letters A to F and numbers",
  },
  applicationNumber: {
    empty: "Enter an application number",
    length: "Application Number must be 8 characters long",
    invalid: "Application Number must be 8 characters long, using only letters and numbers",
  },
  microchipNumber: {
    empty: "Enter a microchip number",
    length: "Microchip Number must be 15 digits long",
    invalid: "Microchip Number must be 15 digits long, using only numbers 0 to 9",
  },
};

export default errorMessages;
