const errorMessages = {
  ptdNumber: {
    empty: "Enter a PTD number",
    length: "Enter 6 characters after 'GB826'",
    invalid: "Enter 6 characters after 'GB826', using only letters and numbers",
  },
  applicationNumber: {
    empty: "Enter an application number",
    length: "Enter 8 characters",
    invalid: "Enter an application number, using only letters and numbers",
  },
  microchipNumber: {
    empty: "Enter a microchip number",
    invalid: "Enter a 15-digit number",
  },
};

export default errorMessages;
