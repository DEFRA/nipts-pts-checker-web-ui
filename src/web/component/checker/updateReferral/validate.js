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

const MAX_CHAR_LENGTH = 500;

const outcomeRadioSchema = Joi.string()
  .required()
  .label(SCHEMA_LABELS.OUTCOME)
  .messages({
    [ERROR_TYPES.STRING_EMPTY]: UpdateReferralErrors.outcomeOptionError,
    [ERROR_TYPES.ANY_REQUIRED]: UpdateReferralErrors.outcomeOptionError,
});

const outcomeReasonSchema = Joi.string()
  .max(MAX_CHAR_LENGTH)
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

const validateUpdateReferralForm = (payload) => {  
      const {
              travelUnderFramework,
              detailsOfOutcome,
              PTDNumberFormatted,
              issuedDate,
              status, 
              microchipNumber,
              petSpecies,
              documentStatusColourMapping,
            } = payload;

      const errorSummary = [];
      let errorSummaryMessage;
      let isValid = true;
      const applicationData = {PTDNumberFormatted, issuedDate, status, microchipNumber, petSpecies, documentStatusColourMapping, travelUnderFramework, detailsOfOutcome};
      
    
      const validationResultRadio = validateOutcomeRadio(travelUnderFramework);
      const validationResultText = validateOutcomeReason(detailsOfOutcome);
    
      if (!validationResultRadio.isValid) {
          errorSummaryMessage = validationResultRadio.error;
          isValid = false;
          errorSummary.push({
            fieldId: "outcomeRadio",
            message: errorSummaryMessage,
          });
      }
    
      if (!validationResultText.isValid) {
          errorSummaryMessage = validationResultText.error;
          isValid = false;
          errorSummary.push({
            fieldId: "detailsOfOutcome",
            message: errorSummaryMessage,
          });
      }
           
      return {
          isValid,
          errorSummary,
          applicationData,
          validationResultRadioError: validationResultRadio.error,
          validationResultTextError: validationResultText.error,
        };
  };



export {
    validateOutcomeRadio,
    validateOutcomeReason,
    validateUpdateReferralForm
};
