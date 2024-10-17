"use strict";

import appSettingsService from "../../../../api/services/appSettingsService.js";
import { validateNonCompliance } from "./validate.js";
import errorMessages from "./errorMessages.js";

const VIEW_PATH = "componentViews/checker/noncompliance/noncomplianceView";

const getNonComplianceHandler = async (request, h) => {
  const data = request.yar.get("data");
  const appSettings = await appSettingsService.getAppSettings();
  const model = { ...appSettings };

  const statusMapping = {
    approved: "Approved",
    awaiting: "Awaiting Verification",
    revoked: "Revoked",
    rejected: "	Unsuccessful",
  };

  const statusColourMapping = {
    approved: "govuk-tag govuk-tag--green",
    awaiting: "govuk-tag govuk-tag--yellow",
    revoked: "govuk-tag govuk-tag--orange",
    rejected: "govuk-tag govuk-tag--red",
  };

  const applicationStatus = data.documentState.toLowerCase().trim();
  const documentStatus = statusMapping[applicationStatus] || applicationStatus;
  const documentStatusColourMapping = statusColourMapping[applicationStatus] || applicationStatus;

  // Clear any previous error data
  return h.view(VIEW_PATH, {
    documentStatus,
    documentStatusColourMapping,
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

    const reportNoncomplianceData = request.yar.get("reportNoncomplianceData") || [];
    // Proceed with further logic if validation passes
    if (payload.microchipNumberRadio === "on") {
      reportNoncomplianceData['microchipNumberRadio'] = payload.microchipNumberRadio;
      reportNoncomplianceData['microchipNumber'] = payload.microchipNumber;      
    }

    if (payload.visualCheckProblem === "on") {
      reportNoncomplianceData["visualCheckProblem"] =
        payload.visualCheckProblem;
    }

     if (payload.otherIssuesCommercialRadio === "on") {
       reportNoncomplianceData["otherIssuesCommercialRadio"] =
         payload.otherIssuesCommercialRadio;
     }

      if (payload.otherIssuesAuthorisedRadio === "on") {
        reportNoncomplianceData["otherIssuesAuthorisedRadio"] =
          payload.otherIssuesAuthorisedRadio;
      }

      if (payload.otherIssuesSomethingRadio === "on") {
        reportNoncomplianceData["otherIssuesSomethingRadio"] =
          payload.otherIssuesSomethingRadio;
      }


    
    // Proceed with further logic if validation passes
    if (payload.relevantComments.length > 0) {
      reportNoncomplianceData["relevantComments"] = payload.relevantComments;
    }

    reportNoncomplianceData["passengerType"] = payload.passengerType;

    reportNoncomplianceData["outcomeReferred"] = payload.outcomeReferred;
    reportNoncomplianceData["outcomeAdvised"] = payload.outcomeAdvised;
    reportNoncomplianceData["outcomeNotTravelling"] = payload.outcomeNotTravelling;
    reportNoncomplianceData["outcomeSPS"] = payload.outcomeSPS;
    reportNoncomplianceData["moreDetail"] = payload.moreDetail;
    

    request.yar.set("reportNoncomplianceData", reportNoncomplianceData);    


    // Redirect to the dashboard
    request.yar.set("successConfirmation", true);
    return h.redirect("/checker/dashboard");
  } catch (error) {
    console.error("Unexpected Error:", error);

    const errorMessage ="The information wasn't recorded, please try to submit again. If you close the application, the information will be lost. You can printscreen or save the information and submit it later.";
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
          dispalyAs: "text"
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
