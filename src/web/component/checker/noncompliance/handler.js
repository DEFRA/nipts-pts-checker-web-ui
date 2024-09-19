"use strict";

import appSettingsService from "../../../../api/services/appSettingsService.js";
import { validateNonCompliance } from "./validate.js";
import errorMessages from "./errorMessage.js";
// Import or define the function to check microchip number association
import microchipApi from "../../../../api/services/microchipAppPtdMainService.js";


const VIEW_PATH = "componentViews/checker/noncompliance/noncomplianceView";

const getNonComplianceHandler = async (request, h) => {
  const data = request.yar.get("data");
  const appSettings = await appSettingsService.getAppSettings();
  const model = { ...appSettings };

  // Clear any previous error data
  return h.view(VIEW_PATH, {
    data,
    model,
    errors: {},
    errorSummary: [],
    formSubmitted: false,
    payload: {},
  });
};

const postNonComplianceHandler = async (request, h) => {
  try {
    const payload = request.payload;
    console.log("Payload:", payload);
    const validationResult = validateNonCompliance(payload);

    if (!validationResult.isValid) {
      const errors = {};
      const errorSummary = validationResult.errors.map((err) => {
        const fieldId = err.path.join("_");
        const message = err.message;
        errors[fieldId] = message;
        return { fieldId, message };
      });

      const data = request.yar.get("data");
      const appSettings = await appSettingsService.getAppSettings();
      const model = { ...appSettings };

      return h.view(VIEW_PATH, {
        data,
        model,
        errors,
        errorSummary,
        formSubmitted: true,
        payload,
      });
    }

    // After validation passes, check if microchip number is associated with another document
    if (payload.microchipNumberRadio === "on") {
      const microchipNumber = payload.microchipNumber;     
      request.yar.set("reportNoncomplianceMicrochipNumber", microchipNumber);
    }

    // Process the valid data here (e.g., save to database)

    // Clear error-related data and payload before redirecting
    request.yar.clear("errors");
    request.yar.clear("errorSummary");
    request.yar.clear("payload");

    // Redirect to a success page or another route
    return h.redirect("/checker/dashboard");
  } catch (error) {
    const errorMessage = errorMessages.serviceError.message;
    const data = request.yar.get("data");
    const appSettings = await appSettingsService.getAppSettings();
    const model = { ...appSettings };

    return h.view(VIEW_PATH, {
      data,
      model,
      errorSummary: [
        {
          fieldId: "unexpected",
          message: errorMessage,
        },
      ],
      formSubmitted: true,
      errors: {},
      payload: request.payload,
    });
  }
};

export const NonComplianceHandlers = {
  getNonComplianceHandler,
  postNonComplianceHandler,
};
