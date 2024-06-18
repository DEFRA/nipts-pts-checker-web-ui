"use strict";
import Joi from "joi";
import { HttpStatusConstants } from "../../../../constants/httpMethod.js";



const validateDocumentSearch = {
  payload: Joi.object({
    documentSearch: Joi.string().required().label("Find a document").messages({
      "string.empty": "Select an option",
      "any.required": "Select an option",
    }),
    ptdNumberSearch: Joi.alternatives().conditional("documentSearch", {
      is: "ptd",
      then: Joi.string().required().label("Search by PTD number").messages({
        "string.empty": "Enter PTD Number",
        "string.pattern.base": "Enter PTD Number",
        "any.required": "Enter PTD Number",
      }),
    }),
  }).options({ abortEarly: false }),
  failAction: (_request, h, error) => {
    return h
      .response({
        status: "fail",
        message: "Validation errors occurred",
        details: error.details,
      })
      .code(HttpStatusConstants.BAD_REQUEST)
      .takeover();
  },
};

export const documentSearchValidation = {
  validateDocumentSearch,
};
