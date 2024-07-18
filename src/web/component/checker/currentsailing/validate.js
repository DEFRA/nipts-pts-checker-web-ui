"use strict";
import Joi from "joi";
import { CurrentSailingMainModelErrors } from "../../../../constants/currentSailingConstant.js";

const routeRadioSchema = Joi.string().required().label('Route').messages({
  'string.empty': CurrentSailingMainModelErrors.routeError,
  'any.required': CurrentSailingMainModelErrors.routeError,
});


const sailingHourSchema = Joi.string().pattern(/^\d{2}$/).required().label('Sailing Hour').messages({
  'string.empty': CurrentSailingMainModelErrors.timeError,
  'string.pattern.base': CurrentSailingMainModelErrors.timeError,
  'any.required': CurrentSailingMainModelErrors.timeError,
});

const sailingMinutesSchema = Joi.string().pattern(/^\d{2}$/).required().label('Sailing Minutes').messages({
  'string.empty': CurrentSailingMainModelErrors.timeError,
  'string.pattern.base': CurrentSailingMainModelErrors.timeError,
  'any.required': CurrentSailingMainModelErrors.timeError,
})

const validateRouteRadio = (radioSelection) => {
const { error } = routeRadioSchema.validate(radioSelection);
return {
isValid: !error,
error: error ? error.details[0].message : null,
};
};


const validateSailingHour = (sailingHour) => {
  const { error } = sailingHourSchema.validate(sailingHour);
  return {
  isValid: !error,
  error: error ? error.details[0].message : null,
  };
  };


  const validateSailingMinutes = (sailingMinutes) => {
    const { error } = sailingMinutesSchema.validate(sailingMinutes);
    return {
    isValid: !error,
    error: error ? error.details[0].message : null,
    };
    };



export  {
  validateRouteRadio,
  validateSailingHour,
  validateSailingMinutes,
};
  