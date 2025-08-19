"use strict";
const errorMessage = "Enter the 15-digit microchip number, using only numbers";


export default {
  missingReason: {
    empty: "Select at least one reason for non-compliance",
  },
  microchipNumber: {
    empty: "Enter the 15-digit microchip number",
    incorrectFormat: "Enter your pet's microchip number in the correct format",
    length: errorMessage,
    letters: errorMessage,
    specialCharacters: errorMessage,
    wrongMicrochip:
      "The microchip number is associated with another lifelong pet travel document",
  },
  passengerType: {
    empty: "Select the type of passenger",
  },
  vehicleRegistration: {
    empty: "Enter a vehicle registration",
  },
  serviceError: {
    message: "An unexpected error occurred while processing your request",
  },
  gbOutcome: {
    incorrectSelection: "You cannot select a GB outcome",
    required: "Select at least one GB outcome",
  },
  spsOutcomeDetails: {
    length: "Outcome summary must be 500 characters or less"
  },
};
