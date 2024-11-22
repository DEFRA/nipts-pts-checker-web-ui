const errorMessages = {
  ptdNumber: {
    empty: "Enter a PTD number",
    length: "Enter 6 characters after 'GB826'",
    invalid: "Enter 6 characters after 'GB826', using only the letters A to F and numbers",
  },
  applicationNumber: {
    empty: "Enter an application number",
    length: "Enter 8 characters",
    invalid: "Enter 8 characters, using only letters and numbers",
  },
  microchipNumber: {
    empty: "Enter a microchip number",
    length: "Enter a 15-digit number",
    invalid: "Enter a 15-digit number, using only numbers",
  },
};

export default errorMessages;
