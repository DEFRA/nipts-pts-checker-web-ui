"use strict";
import Joi from "joi";
import errorMessages from "./errorMessages.js";
import { CheckOutcomeConstants } from "../../../../constants/checkOutcomeConstant.js";


const validOutcomes = [
  CheckOutcomeConstants.Pass,
  CheckOutcomeConstants.Fail,
  CheckOutcomeConstants.IssueSUPTD,
  CheckOutcomeConstants.ReferToSPS,
];

const radioSchema = Joi.string()
  .valid(...validOutcomes)
  .required()
  .messages({
    "string.empty": errorMessages.passOrFailOption.empty,
    "any.required": errorMessages.passOrFailOption.empty,
    "any.only":
      errorMessages.passOrFailOption.invalid || "Please select a valid option",
  });

const validatePassOrFail = (radioSelection) => {
  if (radioSelection === undefined || radioSelection === null) {
    return {
      isValid: false,
      error: errorMessages.passOrFailOption.empty,
    };
  }

  const { error } = radioSchema.validate(radioSelection);
  return {
    isValid: !error,
    error: error ? error.details[0].message : null,
  };
};

export { validatePassOrFail };
