"use strict";
import Joi from "joi";
import errorMessages from "./errorMessages.js";

const microchipNumberLength = 15;

const nonComplianceSchema = Joi.object({
  mcNotMatch: Joi.any(),
  mcNotMatchActual: Joi.when("mcNotMatch", {
    is: "true",
    then: Joi.string()
      .custom((value, helpers) => {
        const val = value || "";
        if (!val.trim()) {
          return helpers.message(errorMessages.microchipNumber.empty);
        }
        if (/\s/.test(val)) {
          return helpers.message(
            errorMessages.microchipNumber.specialCharacters
          );
        }
        if (/[A-Za-z]/.test(val)) {
          if (/[^0-9A-Za-z]/.test(val)) {
            return helpers.message(
              errorMessages.microchipNumber.specialCharacters
            );
          }
          return helpers.message(errorMessages.microchipNumber.letters);
        }
        if (/\D/.test(val)) {
          return helpers.message(
            errorMessages.microchipNumber.specialCharacters
          );
        }
        if (val.length !== microchipNumberLength) {
          return helpers.message(errorMessages.microchipNumber.length);
        }
        return val;
      })
      .required()
      .messages({
        "string.empty": errorMessages.microchipNumber.empty,
        "any.required": errorMessages.microchipNumber.empty,
      }),
    otherwise: Joi.optional(),
  }),
  ptdProblem: Joi.any().optional(),
  passengerType: Joi.string().required().messages({
    "string.empty": errorMessages.passengerType.empty,
    "any.required": errorMessages.passengerType.empty,
  }),
  spsOutcome: Joi.when("isGBCheck", {
    is: true,
    then: Joi.any().custom((_value, helpers) => {
      return helpers.message(errorMessages.spsOutcome.incorrectSelection);
    }),
    otherwise: Joi.any().required().messages({
      "any.required": errorMessages.spsOutcome.required,
    }),
  }),
  gbRefersToDAERAOrSPS: Joi.boolean().optional(),
  gbAdviseNoTravel: Joi.boolean().optional(),
  gbPassengerSaysNoTravel: Joi.boolean().optional(),
  relevantComments: Joi.string().max(500).allow(null, "").optional().messages({
    "string.max": errorMessages.relevantComments.length,
  }),
  spsOutcomeDetails: Joi.string().max(500).allow(null, "").optional().messages({
    "string.max": errorMessages.spsOutcomeDetails.length,
  }),
  isGBCheck: Joi.boolean().custom((value, helpers) => {
    const context = helpers.state.ancestors[0] || {};
    const {
      isGBCheck,
      gbRefersToDAERAOrSPS,
      gbAdviseNoTravel,
      gbPassengerSaysNoTravel,
    } = context;
    if (isGBCheck) {
      const isInvalidOutcome = !gbRefersToDAERAOrSPS && !gbAdviseNoTravel && !gbPassengerSaysNoTravel;
      if (isInvalidOutcome) {
        return helpers.message(errorMessages.gbOutcome.required);
      }
    } else {
      const isIncorrectSelection = gbRefersToDAERAOrSPS || gbAdviseNoTravel || gbPassengerSaysNoTravel;
      if (isIncorrectSelection) {
        return helpers.message(errorMessages.gbOutcome.incorrectSelection);
      }
    }
    return value;
  }),
})
  .or(
    "mcNotMatch",
    "mcNotFound",
    "vcNotMatchPTD",
    "oiFailPotentialCommercial",
    "oiFailAuthTravellerNoConfirmation",
    "oiFailOther"
  )
  .messages({
    "object.missing": errorMessages.missingReason.empty,
  })
  .unknown(true);

const validateNonCompliance = (payload) => {
  try {
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

        if (err.type === "object.missing") {
          customError.path[0] = "missingReason";
        }

        return customError;
      });
    }

    return {
      isValid: !error,
      errors,
    };
  } catch (err) {
    console.error("Validation error:", err);
    return {
      isValid: false,
      errors: [
        {
          message: "An unexpected error occurred during validation",
          path: ["unexpected"],
        },
      ],
    };
  }
};

export { validateNonCompliance };
