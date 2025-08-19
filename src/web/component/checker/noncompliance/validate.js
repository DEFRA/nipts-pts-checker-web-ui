"use strict";
import Joi from "joi";
import errorMessages from "./errorMessages.js";

const MAX_TEXTAREA_LENGTH = 500;

const nonComplianceSchema = Joi.object({
  ptdProblem: Joi.any().optional(),
  passengerType: Joi.string().required().messages({
    "string.empty": errorMessages.passengerType.empty,
    "any.required": errorMessages.passengerType.empty,
  }),
  gbRefersToDAERAOrSPS: Joi.boolean().optional(),
  gbAdviseNoTravel: Joi.boolean().optional(),
  gbPassengerSaysNoTravel: Joi.boolean().optional(),
  spsOutcomeDetails: Joi.string().max(MAX_TEXTAREA_LENGTH).allow(null, "").optional().messages({
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
    "mcNotFound",
    "oiFailAuthTravellerNoConfirmation",
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
    global.appInsightsClient.trackException({ exception: err });
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
