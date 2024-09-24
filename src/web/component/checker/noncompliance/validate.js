"use strict";
import Joi from "joi";
import errorMessages from "./errorMessage.js";

const nonComplianceSchema = Joi.object({
  microchipNumberRadio: Joi.any(),
  microchipNumber: Joi.when("microchipNumberRadio", {
    is: Joi.valid("on"),
    then: Joi.any().custom((value, helpers) => {
      // Handle undefined, null, and empty string values
      const val = value || "";
      const trimmedValue = val.trim();

    // No number entered
      if (!trimmedValue) {
        return helpers.message(errorMessages.microchipNumber.empty);
      }

      // Check if the value contains any letters
      if (/[A-Za-z]/.test(trimmedValue)) {
        // If there are both letters and special characters or numbers with letters
        if (/[^0-9A-Za-z]/.test(trimmedValue)) {
          return helpers.message(errorMessages.microchipNumber.specialCharacters);
        }
        // If only letters or letters combined with numbers
        return helpers.message(errorMessages.microchipNumber.letters);
      }

      // Check if the value contains any special characters (excluding letters and numbers)
      if (/[^0-9]/.test(trimmedValue)) {
        return helpers.message(errorMessages.microchipNumber.specialCharacters);
      }

      // Check length: It must be exactly 15 digits
      if (trimmedValue.length !== 15) {
        return helpers.message(errorMessages.microchipNumber.length);
      }

      // If all checks pass, return the trimmed value
      return trimmedValue;
    }),
    otherwise: Joi.optional(),
  }),
  ptdProblem: Joi.any(),
});

const validateNonCompliance = (payload) => {
  const { error } = nonComplianceSchema.validate(payload, {
    abortEarly: false, // Collect all validation errors
    presence: "optional",
  });

  let errors = [];

  if (error) {
    errors = error.details.map((err) => {
      return {
        message: err.message,
        path: err.path,
      };
    });
  }

  return {
    isValid: !error,
    errors,
  };
};

// Handling errors in the route handler to avoid 403
const postNonComplianceHandler = async (request, h) => {
  try {
    const validationResult = validateNonCompliance(request.payload);

    if (!validationResult.isValid) {
      // Return validation errors to the user
      return h.view("componentViews/checker/noncompliance/noncomplianceView", {
        errors: validationResult.errors.reduce((acc, err) => {
          acc[err.path[0]] = err.message;
          return acc;
        }, {}),
        errorSummary: validationResult.errors.map((err) => ({
          fieldId: err.path[0],
          message: err.message,
        })),
        formSubmitted: true,
        payload: request.payload,
      });
    }

    // Proceed with further logic if validation passes
    // ...
  } catch (err) {
    // Catch unexpected errors and return a 500 error to prevent 403
    console.error("Unexpected Error:", err);
    return h.response({ message: "An unexpected error occurred" }).code(500);
  }
};

export { validateNonCompliance, postNonComplianceHandler };
