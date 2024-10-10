"use strict";
import Joi from "joi";
import errorMessages from "./errorMessages.js";

const radioSchema = Joi.string().required().messages({
        'string.empty': errorMessages.passOrFailOption.empty,
        'any.required': errorMessages.passOrFailOption.empty,
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



  export  {
    validatePassOrFail
  };
  