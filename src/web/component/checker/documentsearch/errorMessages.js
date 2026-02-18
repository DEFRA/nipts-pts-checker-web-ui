const errorMessages = {
  ptdNumber: {
    empty: "Enter a PTD number",
    length: "Enter 6 characters after 'GB826', using only letters A-F and numbers, for example AF4399",
    invalid:
      "Enter 6 characters after 'GB826', using only letters A-F and numbers, for example AF4399",
  },
  applicationNumber: {
    empty: "Enter an application number",
    length: "Enter 8 characters using letters and numbers, for example MOG2TXF7",
    invalid: "Enter 8 characters using letters and numbers, for example MOG2TXF7",
  },
  microchipNumber: {
    empty: "Enter a microchip number",
    length: "Enter a 15-digit number, using only numbers",
    invalid: "Enter a 15-digit number, using only numbers",
  },
};

export default errorMessages;
