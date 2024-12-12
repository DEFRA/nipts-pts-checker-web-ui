"use strict";
import Joi from "joi";
import errorMessages from "./errorMessages.js";

const microchipNumberLength = 15;

const nonComplianceSchema = Joi.object({
  mcNotMatch: Joi.any(),
  mcNotMatchActual: Joi.when("mcNotMatch", {
    is: "true",
    then: Joi.string().custom((value, helpers) => {
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
      if (/[^0-9]/.test(trimmedValue)) {
        return helpers.message(errorMessages.microchipNumber.specialCharacters);
      }

      // Check length: It must be exactly 15 digits
      if (trimmedValue.length !== microchipNumberLength) {
        return helpers.message(errorMessages.microchipNumber.length);
      }

      // If all checks pass, return the trimmed value
      return trimmedValue;
    })
    .required()
      .messages({
        'string.empty':  errorMessages.microchipNumber.empty,
        'any.required': errorMessages.microchipNumber.empty,
      }),
    otherwise: Joi.optional(),
  }),
  ptdProblem: Joi.any().optional(),
  passengerType: Joi.string().required().messages({
    'string.empty': errorMessages.passengerType.empty,
    'any.required': errorMessages.passengerType.empty,
  }),
  spsOutcome: Joi.when("isGBCheck", {
    is: true,
    then: Joi.boolean().custom((_value, helpers) => {
        return helpers.message(errorMessages.spsOutcome.incorrectSelection);
    }),
    otherwise: Joi.boolean()
      .required()
      .messages({
        "any.required": errorMessages.spsOutcome.required,
      }),
  }),
  gbRefersToDAERAOrSPS: Joi.boolean().optional(),
  gbAdviseNoTravel: Joi.boolean().optional(),
  gbPassengerSaysNoTravel: Joi.boolean().optional(),
  isGBCheck: Joi.boolean().custom((value, helpers) => {
    const context = helpers.state.ancestors[0] || {}; // Default to empty object if context is undefined
    const { isGBCheck, gbRefersToDAERAOrSPS, gbAdviseNoTravel, gbPassengerSaysNoTravel } = context;
    if(isGBCheck)
    {
      if(!gbRefersToDAERAOrSPS && !gbAdviseNoTravel && !gbPassengerSaysNoTravel)
      {
          return helpers.message(errorMessages.gbOutcome.required);
      }
    }
    else if(gbRefersToDAERAOrSPS || gbAdviseNoTravel || gbPassengerSaysNoTravel)
    {
          return helpers.message(errorMessages.gbOutcome.incorrectSelection);
    }

    return value;
  })
})
.or("mcNotMatch", "mcNotFound", "vcNotMatchPTD", "oiFailPotentialCommercial", "oiFailAuthTravellerNoConfirmation", "oiFailOther")
.messages({
  "object.missing": errorMessages.missingReason.empty,
})
.unknown(true);

const validateNonCompliance = (payload) => {
  const { error } = nonComplianceSchema.validate(payload, {
    abortEarly: false,
    presence: "optional",
  });

  let errors = [];

  if (error) {
    errors = error.details.map((err) => {
      const customError = {
        message: err.message,
        path: err.path,
      };

      // Add fieldId for "object.missing" error specifically
      if (err.type === "object.missing") {
        customError.path[0] = "missingReason"; // Include relevant field IDs
      }

      return customError;
    });
  }

  return {
    isValid: !error,
    errors,
  };
};

export { validateNonCompliance };
