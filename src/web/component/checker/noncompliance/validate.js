"use strict";
import Joi from "joi";
import errorMessages from "./errorMessages.js";

const microchipNumberLength = 15;

const nonComplianceSchema = Joi.object({
  microchipNumberRadio: Joi.any(),
  microchipNumber: Joi.when("microchipNumberRadio", {
    is: Joi.valid("on"),
    then: Joi.any().custom((value, helpers) => {
      const val = value || "";
      const trimmedValue = val.trim();

      // No number entered
      if (!trimmedValue) {
        return helpers.message(errorMessages.microchipNumber.empty);
      }

      // Check if the value contains any letters
      if (/[A-Za-z]/.test(trimmedValue)) {
        if (/[^0-9A-Za-z]/.test(trimmedValue)) {
          return helpers.message(
            errorMessages.microchipNumber.specialCharacters
          );
        }
        return helpers.message(errorMessages.microchipNumber.letters);
      }

      // Check if the value contains any special characters (excluding letters and numbers)
      if (/\D/.test(trimmedValue)) {
        return helpers.message(errorMessages.microchipNumber.specialCharacters);
      }

      // Check length: It must be exactly 15 digits
      if (trimmedValue.length !== microchipNumberLength) {
        return helpers.message(errorMessages.microchipNumber.length);
      }

      // If all checks pass, return the trimmed value
      return trimmedValue;
    }),
    otherwise: Joi.optional(),
  }),
  ptdProblem: Joi.any().optional(),
  passengerType: Joi.string().required().messages({
    'string.empty': errorMessages.passengerType.empty,
    'any.required': errorMessages.passengerType.empty,
  }),
}).unknown(true);

const validateNonCompliance = (payload) => {
  const { error } = nonComplianceSchema.validate(payload, {
    abortEarly: false,
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
