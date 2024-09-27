"use strict";

import appSettingsService from "../../../../api/services/appSettingsService.js";
import { validateNonCompliance } from "./validate.js";
import errorMessages from "./errorMessage.js";

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
    const validationResult = validateNonCompliance(payload);

    console.log("Validation Result:", validationResult);

    if (!validationResult.isValid) {
      const errors = {};
      const errorSummary = [];

      validationResult.errors.forEach((err) => {
        const fieldId = err.path.join("_");
        const message = err.message;

        // Only process microchipNumber errors if the checkbox is selected
        if (
          fieldId === "microchipNumber" &&
          payload.microchipNumberRadio !== "on"
        ) {
          // Skip this error
          return;
        }

        // Skip errors for fields that are optional
        if (fieldId === "microchipNumberRadio" || fieldId === "ptdProblem") {
          return;
        }

        // Handle any unexpected errors
        if (!fieldId) {
          return;
        }

        errors[fieldId] = message;
        errorSummary.push({ fieldId, message });
      });

      // If there are errors after filtering, render the view with errors
      if (Object.keys(errors).length > 0) {
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
    }

    let reportNoncomplianceData = request.yar.get("reportNoncomplianceData") || [];
    // Proceed with further logic if validation passes
    if (payload.microchipNumberRadio === "on") {
      reportNoncomplianceData['microchipNumberRadio'] = payload.microchipNumberRadio;
      reportNoncomplianceData['microchipNumber'] = payload.microchipNumber;      
    }

    if (payload.visualCheckProblem === "on") {
      reportNoncomplianceData["visualCheckProblem"] =
        payload.visualCheckProblem;
    }

    
    // Proceed with further logic if validation passes
    if (payload.relevantComments.length > 0) {
      reportNoncomplianceData["relevantComments"] = payload.relevantComments;
    }

    reportNoncomplianceData["passengerType"] = payload.passengerType;

    request.yar.set("reportNoncomplianceData", reportNoncomplianceData);    


    // Redirect to the dashboard
    return h.redirect("/checker/dashboard");
  } catch (error) {
    console.error("Unexpected Error:", error);

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
