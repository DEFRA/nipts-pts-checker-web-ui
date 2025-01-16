"use strict";
import  { validateRouteOptionRadio, validateRouteRadio, validateSailingHour, validateSailingMinutes, validateFlightNumber, validateDate } from "../../../../../web/component/checker/currentsailing/validate.js";
import { CurrentSailingMainModelErrors } from "../../../../../constants/currentSailingConstant.js";


describe('Validation Functions', () => {
  describe('validateRouteOptionRadio', () => {
    it('should return valid for a non-empty string', () => {
      const result = validateRouteOptionRadio('1');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should return invalid for an empty string', () => {
      const result = validateRouteOptionRadio('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.routeOptionError); // Replace with your actual error message
    });

    it('should return invalid for undefined', () => {
      const result = validateRouteOptionRadio(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.routeOptionError); // Replace with your actual error message
    });
  });

  describe('validateRouteRadio', () => {
    it('should return valid for a non-empty string', () => {
      const result = validateRouteRadio('1');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should return invalid for an empty string', () => {
      const result = validateRouteRadio('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.routeError); // Replace with your actual error message
    });

    it('should return invalid for undefined', () => {
      const result = validateRouteRadio(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.routeError); // Replace with your actual error message
    });
  });

  describe('validateSailingHour', () => {
    it('should return valid for a two-digit string', () => {
      const result = validateSailingHour('08');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should return invalid for a single-digit string', () => {
      const result = validateSailingHour('8');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.timeError); // Replace with your actual error message
    });

    it('should return invalid for an empty string', () => {
      const result = validateSailingHour('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.timeError); // Replace with your actual error message
    });

    it('should return invalid for undefined', () => {
      const result = validateSailingHour(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.timeError); // Replace with your actual error message
    });
  });

  describe('validateSailingMinutes', () => {
    it('should return valid for a two-digit string', () => {
      const result = validateSailingMinutes('30');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should return invalid for a single-digit string', () => {
      const result = validateSailingMinutes('3');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.timeError); // Replace with your actual error message
    });

    it('should return invalid for an empty string', () => {
      const result = validateSailingMinutes('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.timeError); // Replace with your actual error message
    });

    it('should return invalid for undefined', () => {
      const result = validateSailingMinutes(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.timeError); // Replace with your actual error message
    });
  });

  describe('validateFlightNumber', () => {
    it('should return valid for a non-empty string', () => {
      const result = validateFlightNumber('1');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should return invalid for an empty string', () => {
      const result = validateFlightNumber('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.flightNoEmptyError); // Replace with your actual error message
    });

    it('should return invalid for undefined', () => {
      const result = validateFlightNumber(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.flightNoEmptyError); // Replace with your actual error message
    });
  });

  describe('validateDate', () => {
    it('should return valid for a non-empty string', () => {
      const result = validateDate('1/1/2024');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should return required eror for a partial empty string', () => {
      const result = validateDate('33//2024');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.departureDateFormatError);
    });

    it('should return invalid format for a non-empty string', () => {
      const result = validateDate('33/1/2024');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(CurrentSailingMainModelErrors.departureDateFormatError);
    });

    it('should return invalid for an empty string', () => {
      const result = validateDate('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('The date cannot be empty.'); // Replace with your actual error message
    });

    it('should return invalid for undefined', () => {
      const result = validateDate(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('The date is required.'); // Replace with your actual error message
    });
  });

});

