"use strict";
import Joi from "joi";
import  { CurrentSailingHandlers } from "./handler.js";
import  HttpMethod  from "../../../../constants/httpMethod.js";

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/checker/current-sailings",
    config: CurrentSailingHandlers.getCurrentSailings.index,
  },
  {
    method: HttpMethod.POST,
    path: '/checker/sailing-slot',
    options: {
      validate: {
        
        payload: Joi.object({
          routeRadio: Joi.string().required().label('Route').messages({
            'string.empty': 'Select a route',
            'any.required': 'Select a route',
          }),
          sailingHour: Joi.string().pattern(/^\d{2}$/).required().label('Sailing Hour').messages({
            'string.empty': 'Select the hours and minutes for a scheduled sailing time',
            'string.pattern.base': 'Select the hours and minutes for a scheduled sailing time',
            'any.required': 'Select the hours and minutes for a scheduled sailing time',
          }),
          sailingMinutes: Joi.string().pattern(/^\d{2}$/).required().label('Sailing Minutes').messages({
            'string.empty': 'Select the hours and minutes for a scheduled sailing time',
            'string.pattern.base': 'Select the hours and minutes for a scheduled sailing time',
            'any.required': 'Select the hours and minutes for a scheduled sailing time',
          }),
        }).options({ abortEarly: false }),
        failAction: (request, h, error) => {
          return h.response({
            status: "fail",
            message: "Validation errors occurred",
            details: error.details,
          }).code(400).takeover();
        }
      },
      handler: CurrentSailingHandlers.submitCurrentSailingSlot
    }
  },
  {
    method: HttpMethod.GET,
    path: '/checker/sailing-slot',
    options: {
      handler: CurrentSailingHandlers.getCurrentSailingSlot
    }
  },
];

export default Routes;