"use strict";
import  { CurrentSailingValidation } from "../../../../../web/component/checker/currentsailing/validate.js";
import { CurrentSailingMainModelErrors } from "../../../../../constants/currentSailingConstant.js";

describe('validateSailings', () => {
  const { payload, failAction } = CurrentSailingValidation.validateSailings;

  const validData = {
    routeRadio: 'someRoute',
    sailingHour: '12',
    sailingMinutes: '30',
  };

  const invalidData = {
    routeRadio: '',
    sailingHour: 'ab',
    sailingMinutes: 'cd',
  };

  test('should pass validation with valid data', () => {
    const { error } = payload.validate(validData);
    expect(error).toBeUndefined();
  });

  test('should fail validation with invalid route data', () => {
    const { error } = payload.validate(invalidData);
    expect(error).not.toBeUndefined();
    expect(error.details).toHaveLength(3);
    expect(error.details.map(err => err.message)).toEqual(expect.arrayContaining([
        CurrentSailingMainModelErrors.routeError,
        CurrentSailingMainModelErrors.timeError,
        CurrentSailingMainModelErrors.timeError,
    ]));
  });

  test('should fail validation with invalid sailing data', () => {
   const invalidSailingData = {
        routeRadio: 'someRoute',
        sailingHour: '',
        sailingMinutes: 'cd',
      };

    const { error } = payload.validate(invalidSailingData);
    expect(error).not.toBeUndefined();
    expect(error.details).toHaveLength(2);
    expect(error.details.map(err => err.message)).toEqual(expect.arrayContaining([
        CurrentSailingMainModelErrors.timeError,
        CurrentSailingMainModelErrors.timeError,
    ]));
  });

  test('should handle validation failure correctly', () => {
    const request = { payload: invalidData };
    const h = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis(),
      takeover: jest.fn().mockReturnThis(),
    };

    const error = {
      details: [
        { message: CurrentSailingMainModelErrors.routeError, context: { key: 'routeRadio' } },
        { message: CurrentSailingMainModelErrors.timeError, context: { key: 'sailingHour' } },
        { message: CurrentSailingMainModelErrors.timeError, context: { key: 'sailingMinutes' } },
      ],
    };

    failAction(request, h, error);

    expect(h.response).toHaveBeenCalledWith({
      status: "fail",
      message: CurrentSailingMainModelErrors.genericError,
      details: error.details,
    });
    expect(h.code).toHaveBeenCalledWith(400);
    expect(h.takeover).toHaveBeenCalled();
  });
});
