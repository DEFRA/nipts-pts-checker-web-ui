import Joi from "joi";
import errorMessages from "./errorMessages.js";

const ptdNumberLength = 6;
const applicationNumerLength = 8;
const microchipNumberLength = 15;

const ptdNumberSchema = Joi.string()
  .required()
  .messages({
    "any.required": errorMessages.ptdNumber.empty,
    "string.empty": errorMessages.ptdNumber.empty,
  })
  .pattern(/^[a-fA-F0-9]+$/)
  .length(ptdNumberLength)
  .messages({
    "string.pattern.base": errorMessages.ptdNumber.invalid,
    "string.length": errorMessages.ptdNumber.length,
  });

const applicationNumberSchema = Joi.string()
  .length(applicationNumerLength)
  .pattern(/^[a-zA-Z0-9]+$/)
  .required()
  .messages({
    "any.required": errorMessages.applicationNumber.empty,
    "string.empty": errorMessages.applicationNumber.empty,
    "string.length": errorMessages.applicationNumber.length,
    "string.pattern.base": errorMessages.applicationNumber.invalid,
  });

const microchipNumberSchema = Joi.string()
  .length(microchipNumberLength)
  .pattern(/^\d{15}$/)
  .required()
  .messages({
    "any.required": errorMessages.microchipNumber.empty,
    "string.empty": errorMessages.microchipNumber.empty,
    "string.length": errorMessages.microchipNumber.invalid,
    "string.pattern.base": errorMessages.microchipNumber.invalid,
  });

const validatePtdNumber = (ptdNumber) => {
  const { error } = ptdNumberSchema.validate(ptdNumber);
  return {
    isValid: !error,
    error: error ? error.details[0].message : null,
  };
};



const validateApplicationNumber = (applicationNumber) => {
  const { error } = applicationNumberSchema.validate(applicationNumber, {
    abortEarly: false,
  });
  if (!error) {
    return { isValid: true, error: null };
  }
  // Prioritize pattern error over length error
  const patternError = error.details.find(
    (detail) => detail.type === "string.pattern.base"
  );
  if (patternError) {
    return { isValid: false, error: patternError.message };
  }
  // Otherwise, return the first error
  return { isValid: false, error: error.details[0].message };
};


const validateMicrochipNumber = (microchipNumber) => {
  const { error } = microchipNumberSchema.validate(microchipNumber);
  return {
    isValid: !error,
    error: error ? error.details[0].message : null,
  };
};

export {
  validatePtdNumber,
  validateApplicationNumber,
  validateMicrochipNumber,
};
