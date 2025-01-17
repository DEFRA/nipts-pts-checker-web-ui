"use strict";
import Joi from "joi";
import { CurrentSailingMainModelErrors } from "../../../../constants/currentSailingConstant.js";

const routeOptionRadioSchema = Joi.string().required().label('RouteOption').messages({
  'string.empty': CurrentSailingMainModelErrors.routeOptionError,
  'any.required': CurrentSailingMainModelErrors.routeOptionError,
});

const routeRadioSchema = Joi.string().required().label('Route').messages({
  'string.empty': CurrentSailingMainModelErrors.routeError,
  'any.required': CurrentSailingMainModelErrors.routeError,
});

const flightSchema = Joi.string()
  .pattern(/^(?=.{1,8}$)[A-Za-z0-9]+( [A-Za-z0-9]+)*$/)
  .required()
  .label('Flight')
  .messages({
    'string.empty': CurrentSailingMainModelErrors.flightNoEmptyError,
    'string.pattern.base': CurrentSailingMainModelErrors.flightNumberFormatError,
    'any.required': CurrentSailingMainModelErrors.flightNoEmptyError,
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
});

// Function to check if a year is a leap year
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// Function to get the number of days in a month
function daysInMonth(month, year) {
  // Months with 31 days
  const month31Days = [1, 3, 5, 7, 8, 10, 12];
  if (month31Days.includes(month)) {
    return 31;
  }
  // Months with 30 days
  if ([4, 6, 9, 11].includes(month)) {
    return 30;
  }
  // February
  return isLeapYear(year) ? 29 : 28;
}

const dateSchema = Joi.string()
  .required()
  .custom((value, helpers) => {
    const parts = value.split('/');

    const noDateProvided = parts.every(part => part.trim() === '');
    if(noDateProvided)
      {
        return helpers.error('date.required');
      }
  
    // Regex to match the format D/M/YYYY or DD/MM/YYYY
    const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const match = value.match(regex);

    if (!match) {
      return helpers.error('date.format');
    }

     // Extract day, month, and year
     const [_, day, month, year] = match.map(part => parseInt(part, 10));

     // Validate day and month ranges
     if (month < 1 || month > 12) {
       return helpers.error('date.format');
     }
 
     // Validate day range based on month and year
    const maxDays = daysInMonth(month, year);
    if (day < 1 || day > maxDays) {
      return helpers.error('date.format');
    }

    return value; // Valid date string
  })
  .label('Date')
  .messages({
    'date.format': CurrentSailingMainModelErrors.departureDateFormatError,
    'date.required': CurrentSailingMainModelErrors.departureDateRequiredError,
    'any.required': 'The date is required.',
    'string.empty': 'The date cannot be empty.',
  });



const validateRouteRadio = (radioSelection) => {
    const { error } = routeRadioSchema.validate(radioSelection);
    return {
    isValid: !error,
    error: error ? error.details[0].message : null,
    };
  };

const validateRouteOptionRadio = (radioOptionSelection) => {
    const { error } = routeOptionRadioSchema.validate(radioOptionSelection);
    return {
    isValid: !error,
    error: error ? error.details[0].message : null,
    };
  };

const validateFlightNumber = (flightNumber) => {
    const { error } = flightSchema.validate(flightNumber);
    return {
    isValid: !error,
    error: error ? error.details[0].message : null,
    };
  };

  const validateDate = (date) => {
    const { error } = dateSchema.validate(date);
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

    const validateDateRange = (date, zeroDate) => {
      const now = new Date();
    
      const [datePart, timePart] = date.split(' ');
    
      const [day, month, year] = datePart.split('/').map(Number);
    
      let hours = 0;
      let minutes = 0;
      if (timePart) {
        [hours, minutes] = timePart.split(':').map(Number);
      }
    
      const sailingDate = new Date(year, month - 1, day, hours, minutes);
    
      if (zeroDate) {
        sailingDate.setHours(0, 0, 0, 0);
      }
    
      // Set the bounds for validation
      const lowerBound = new Date(now);
      lowerBound.setDate(now.getDate() - 2); // 48 hours in the past
      const upperBound = new Date(now);
      upperBound.setDate(now.getDate() + 1); // 24 hours in the future
    
      if (sailingDate < lowerBound || sailingDate > upperBound) {
        return {
          isValid: false,
          error: CurrentSailingMainModelErrors.timeOutOfBoundsError,
        };
      }
    
      return { isValid: true, error: null };
    };
    

export  {
  validateRouteOptionRadio,
  validateRouteRadio,
  validateSailingHour,
  validateSailingMinutes,
  validateFlightNumber,
  validateDate,
  validateDateRange
};
  