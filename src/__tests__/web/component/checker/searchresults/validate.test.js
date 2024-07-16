import Joi from 'joi';
import {
    validatePassOrFail
  } from "../../../../../web/component/checker/searchresults/validate";
  import errorMessages from "../../../../../web/component/checker/searchresults/errorMessage";



describe('validatePassOrFail Schema', () => {
  it('should validate successfully when radio buttons are present and checklist is selected', () => {
    const payload = {
      radioButtonsPresent: true,
      checklist: 'option1',
    };

    const { error } = validatePassOrFail.payload.validate(payload);
    expect(error).toBeUndefined();
  });

  it('should fail validation when radio buttons are present and checklist is not selected', () => {
    const payload = {
      radioButtonsPresent: true,
      checklist: '',
    };

    const { error } = validatePassOrFail.payload.validate(payload);
    expect(error).toBeDefined();
    expect(error.details[0].message).toBe(errorMessages.passOrFailOption.empty);
  });

  it('should validate successfully when radio buttons are not present', () => {
    const payload = {
      radioButtonsPresent: false,
      checklist: '',
    };

    const { error } = validatePassOrFail.payload.validate(payload);
    expect(error).toBeUndefined();
  });

  it('should fail validation when radioButtonsPresent is missing', () => {
    const payload = {
      checklist: '',
    };

    const { error } = validatePassOrFail.payload.validate(payload);
    expect(error).toBeDefined();
    expect(error.details[0].message).toContain('"radioButtonsPresent" is required');
  });

  it('should validate successfully when radio buttons are not present and checklist has any value', () => {
    const payload = {
      radioButtonsPresent: false,
      checklist: 'any value',
    };

    const { error } = validatePassOrFail.payload.validate(payload);
    expect(error).toBeUndefined();
  });
});
