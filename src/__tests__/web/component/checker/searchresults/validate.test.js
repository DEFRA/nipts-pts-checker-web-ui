import {
    validatePassOrFail
  } from "../../../../../web/component/checker/searchresults/validate";
  import errorMessages from "../../../../../web/component/checker/searchresults/errorMessages";

describe('validatePassOrFail', () => {
    it('should return valid for a non-empty string', () => {
        const result = validatePassOrFail('Pass');
        expect(result.isValid).toBe(true);
        expect(result.error).toBe(null);
    });

    it('should return invalid for an empty string', () => {
        const result = validatePassOrFail('');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(errorMessages.passOrFailOption.empty);
    });

    it('should return invalid for undefined', () => {
        const result = validatePassOrFail(undefined);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(errorMessages.passOrFailOption.empty);
    });

    it('should return invalid for null', () => {
        const result = validatePassOrFail(null);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(errorMessages.passOrFailOption.empty);
    });
});
