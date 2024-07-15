"use strict";
import Joi from "joi";
import errorMessages from "./errorMessage.js";
import { HttpStatusConstants } from "../../../../constants/httpMethod.js";

const schema = Joi.object({
  radioButtonsPresent: Joi.boolean().required(), // Flag to indicate presence of radio buttons
  checklist: Joi.when('radioButtonsPresent', {
    is: true,
    then: Joi.string().required().messages({
      'string.empty': errorMessages.passOrFailOption.empty,
      'any.required': errorMessages.passOrFailOption.empty,
    }),
    otherwise: Joi.string().optional().allow('')
  })
}).options({ abortEarly: false });


const validatePassOrFail = {
  payload: schema,
  failAction: (_request, h, error) => {
    return h.response({
      status: "fail",
      message: errorMessages.passOrFailOption.genericError,
      details: error.details,
    }).code(HttpStatusConstants.BAD_REQUEST).takeover();
  }
};

  export  {
    validatePassOrFail
  };
  