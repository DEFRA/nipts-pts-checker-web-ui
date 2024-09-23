"use strict";
import Joi from "joi";
import errorMessages from "./errorMessage.js";

const nonComplianceSchema = Joi.object({
  microchipNumberRadio: Joi.any(),
  microchipNumber: Joi.when("microchipNumberRadio", {
    is: Joi.valid("on"),
    then: Joi.any().custom((value, helpers) => {
      // Handle undefined, null, and empty string values
      const val = value || "";

      const trimmedValue = val.trim();

      if (!trimmedValue) {
        return helpers.message(errorMessages.microchipNumber.empty);
      }

      // Check if the value contains any letters or special characters
      if (/[^0-9]/.test(trimmedValue)) {
        if (
          /[A-Za-z]/.test(trimmedValue) &&
          /[^0-9A-Za-z]/.test(trimmedValue)
        ) {
          // Case where both letters and special characters are present
          return helpers.message(errorMessages.microchipNumber.incorrectFormat);
        } else if (/[^0-9A-Za-z]/.test(trimmedValue)) {
          // Special characters without letters
          return helpers.message(
            errorMessages.microchipNumber.specialCharacters
          );
        } else if (/[A-Za-z]/.test(trimmedValue)) {
          // Only letters present
          return helpers.message(errorMessages.microchipNumber.letters);
        }
      }

      // Check length: It must be exactly 15 digits
      if (trimmedValue.length !== 15) {
        return helpers.message(errorMessages.microchipNumber.length);
      }

      // Check length
      if (trimmedValue.length !== 15) {
        return helpers.message(errorMessages.microchipNumber.length);
      }

      // If all checks pass
      return trimmedValue;
    }),
    otherwise: Joi.optional(),
  }),
  ptdProblem: Joi.any(),
});

const validateNonCompliance = (payload) => {
  const { error } = nonComplianceSchema.validate(payload, {
    abortEarly: false,
    // Set presence to optional to prevent Joi from requiring fields by default
    presence: "optional",
  });
  let errors = [];

  if (error) {
    errors = error.details.map((err) => {
      return {
        message: err.message,
        path: err.path,
      };
    });
  }

  return {
    isValid: !error,
    errors,
  };
};

export { validateNonCompliance };
