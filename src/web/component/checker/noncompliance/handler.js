"use strict";

import appSettingsService from "../../../../api/services/appSettingsService.js";
import { validateNonCompliance } from "./validate.js";
import apiService from "../../../../api/services/apiService.js";
import { getJourneyDetails, createCheckOutcome, updateNonComplianceYarSessions, formatPTDNumber } from "../../../helper/nonComplinaceHelper.js";


const VIEW_PATH = "componentViews/checker/noncompliance/noncomplianceView";

const statusMapping = {
  approved: "Approved",
  awaiting: "Pending",
  revoked: "Cancelled",
  rejected: "	Unsuccessful",
};

const statusColourMapping = {
  approved: "govuk-tag govuk-tag--green",
  awaiting: "govuk-tag govuk-tag--blue",
  revoked: "govuk-tag govuk-tag--red",
  rejected: "govuk-tag govuk-tag--red",
};

const fieldIdSortOrdering = [ // add more fields if needed
  'missingReason',
  'passengerType',
  'relevantComments',
  'spsOutcome',
  'isGBCheck',
  'spsOutcomeDetails',
]

const getPtdFormatted = (data) => {
  return data?.ptdNumber ? formatPTDNumber(data.ptdNumber) : "";
};

const getNonComplianceHandler = async (request, h) => {
  const data = request.yar.get("data");

  data.ptdFormatted = getPtdFormatted(data);
  data.isGBCheck = request.yar.get("isGBCheck");

  const appSettings = appSettingsService.getAppSettings();
  const model = { ...appSettings };

  const applicationStatus = data.documentState.toLowerCase().trim();
  const documentStatus = statusMapping[applicationStatus] || applicationStatus;
  const documentStatusColourMapping =
    statusColourMapping[applicationStatus] || applicationStatus;

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
    payload.isGBCheck = request.yar.get("isGBCheck");
    const validationResult = validateNonCompliance(payload);
    const appSettings = appSettingsService.getAppSettings();
    const model = { ...appSettings };
    

    console.log("Validation Result:", validationResult);
    const data = request.yar.get("data");
    const applicationStatus = data.documentState.toLowerCase().trim();
    const documentStatus = statusMapping[applicationStatus] || applicationStatus;
    const documentStatusColourMapping =
      statusColourMapping[applicationStatus] || applicationStatus;

    data.ptdFormatted = getPtdFormatted(data);
    data.isGBCheck = request.yar.get("isGBCheck");

    if (!validationResult.isValid) {
      const errors = {};
      const errorSummary = [];

      validationResult.errors.forEach((err) => {
        const fieldId = err.path.join("_");
        const message = err.message;

        // Handle any unexpected errors
        if (!fieldId) {
          return;
        }

        errors[fieldId] = message;
        errorSummary.push({ fieldId, message });
      });

      errorSummary.sort((error1, error2) => {
        return fieldIdSortOrdering.indexOf(error1.fieldId) - fieldIdSortOrdering.indexOf(error2.fieldId);
      })

      // If there are errors after filtering, render the view with errors
      if (Object.keys(errors).length > 0) {
        return h.view(VIEW_PATH, {
          documentStatus,
          documentStatusColourMapping,
          data,
          model,
          errors,
          errorSummary,
          formSubmitted: true,
          payload,
        });
      }
    }

    if (request.yar.get("IsFailSelected")) {
        await saveReportNonCompliance(payload, data);
    }

    updateNonComplianceYarSessions(request);

    return h.redirect("/checker/dashboard");
  } catch (error) {
    global.appInsightsClient.trackException({ exception: error });
    console.error("Unexpected Error:", error);
    throw error;
  }

  async function saveReportNonCompliance(payload, data) {
    try{    
    const isGBCheck = request.yar.get("isGBCheck");
    const { dateTimeString, routeId, routeOptionId, flightNumber } = getJourneyDetails(request, isGBCheck);

    const context = {
          data,
          payload,
          isGBCheck,
          dateTimeString,
          routeId,
          routeOptionId,
          flightNumber
        };

    // Call the helper function to create the checkOutcome object
    const checkOutcome = createCheckOutcome(request, context);

    const responseData = await apiService.reportNonCompliance(
      checkOutcome,
      request
    );

    return responseData;
  } catch (error) {
    global.appInsightsClient.trackException({ exception: error });
    console.error("Error fetching data:", error.message);

    throw error;
   }
  }
};

const postNonComplianceBackHandler = async (request, h) => {
  request.yar.set("nonComplianceToSearchResults", true);
  return h.redirect("/checker/search-results");
};

export const NonComplianceHandlers = {
  getNonComplianceHandler,
  postNonComplianceHandler,
  postNonComplianceBackHandler,
};



