"use strict";
const errorMessage = "Enter the 15-digit microchip number, using only numbers";
const spaceErrorMessage =
  "Enter your pet's 15-digit microchip number - do not use spaces or special characters like hyphens or dashes";

export default {
  missingReason: {
    empty: "Select at least one reason for non-compliance",
  },
  microchipNumber: {
    empty: "Enter the 15-digit microchip number",
    incorrectFormat: "Enter your pet's microchip number in the correct format",
    length: errorMessage,
    letters: errorMessage,
    specialCharacters: spaceErrorMessage,
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
  spsOutcome: {
    incorrectSelection: "You cannot select an SPS outcome",
    required: "Select if travel is allowed or not allowed",
  },
  gbOutcome: {
    incorrectSelection: "You cannot select a GB outcome",
    required: "Select at least one GB outcome",
  },
};
