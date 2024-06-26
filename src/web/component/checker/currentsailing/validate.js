"use strict";
import Joi from "joi";
import { CurrentSailingMainModelErrors } from "../../../../constants/currentSailingConstant.js";
import { HttpStatusConstants } from "../../../../constants/httpMethod.js";

const validateSailings = {
        payload: Joi.object({
          routeRadio: Joi.string().required().label('Route').messages({
            'string.empty': CurrentSailingMainModelErrors.routeError,
            'any.required': CurrentSailingMainModelErrors.routeError,
          }),
          sailingHour: Joi.string().pattern(/^\d{2}$/).required().label('Sailing Hour').messages({
            'string.empty': CurrentSailingMainModelErrors.timeError,
            'string.pattern.base': CurrentSailingMainModelErrors.timeError,
            'any.required': CurrentSailingMainModelErrors.timeError,
          }),
          sailingMinutes: Joi.string().pattern(/^\d{2}$/).required().label('Sailing Minutes').messages({
            'string.empty': CurrentSailingMainModelErrors.timeError,
            'string.pattern.base': CurrentSailingMainModelErrors.timeError,
            'any.required': CurrentSailingMainModelErrors.timeError,
          }),
        }).options({ abortEarly: false }),
        failAction: (_request, h, error) => {
          return h.response({
            status: "fail",
            message: CurrentSailingMainModelErrors.genericError,
            details: error.details,
          }).code(HttpStatusConstants.BAD_REQUEST).takeover();
        }
  };

  export const CurrentSailingValidation = {
    validateSailings,
  };
  