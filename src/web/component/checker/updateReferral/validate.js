"use strict";
import Joi from "joi";
import { UpdateReferralErrors } from "../../../../constants/updateReferralOutcomeConstant.js";

const SCHEMA_LABELS = {
  OUTCOME: "Outcome",
};

const ERROR_TYPES = {
  STRING_EMPTY: "string.empty",
  ANY_REQUIRED: "any.required",
  MAX_LENGTH: "string.max"
};

const outcomeRadioSchema = Joi.string()
  .required()
  .label(SCHEMA_LABELS.OUTCOME)
  .messages({
    [ERROR_TYPES.STRING_EMPTY]: UpdateReferralErrors.outcomeOptionError,
    [ERROR_TYPES.ANY_REQUIRED]: UpdateReferralErrors.outcomeOptionError,
});

const outcomeReasonSchema = Joi.string()
  .max(500)
  .required()
  .messages({
    [ERROR_TYPES.ANY_REQUIRED]: UpdateReferralErrors.outcomeTextError,
    [ERROR_TYPES.STRING_EMPTY]: UpdateReferralErrors.outcomeTextError,
    [ERROR_TYPES.MAX_LENGTH]: UpdateReferralErrors.outcomeTextLengthError,
  });



const validateOutcomeRadio = (radioSelection) => {
  const { error } = outcomeRadioSchema.validate(radioSelection);
  return {
    isValid: !error,
    error: error ? error.details[0].message : null,
  };
};

const validateOutcomeReason = (outcomeReason) => {
  const { error } = outcomeReasonSchema.validate(outcomeReason);
  if (!error) {
    return { isValid: true, error: null };
  }

  return { isValid: false, error: error.details[0].message };
};



export {
  validateOutcomeRadio,
  validateOutcomeReason
};
