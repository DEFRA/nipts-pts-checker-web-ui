"use strict";

import appSettingsService from "../../../../api/services/appSettingsService.js";
import { validateNonCompliance } from "./validate.js";
import { CheckOutcomeConstants } from "../../../../constants/checkOutcomeConstant.js";
import errorMessages from "./errorMessages.js";
import apiService from "../../../../api/services/apiService.js";
import { CurrentSailingRouteOptions } from "../../../../constants/currentSailingConstant.js";


const VIEW_PATH = "componentViews/checker/noncompliance/noncomplianceView";

const genericErrorMessage = "The information wasn't recorded, please try to submit again. If you close the application, the information will be lost. You can printscreen or save the information and submit it later.";

const statusMapping = {
  approved: "Approved",
  awaiting: "Awaiting verification",
  revoked: "Revoked",
  rejected: "	Unsuccessful",
};

const statusColourMapping = {
  approved: "govuk-tag govuk-tag--green",
  awaiting: "govuk-tag govuk-tag--yellow",
  revoked: "govuk-tag govuk-tag--orange",
  rejected: "govuk-tag govuk-tag--red",
};

const getNonComplianceHandler = async (request, h) => {
  const data = request.yar.get("data");
  const appSettings = await appSettingsService.getAppSettings();
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
    const validationResult = validateNonCompliance(payload);
    const appSettings = await appSettingsService.getAppSettings();
    const model = { ...appSettings };

    console.log("Validation Result:", validationResult);
    const data = request.yar.get("data");
    const applicationStatus = data.documentState.toLowerCase().trim();
    const documentStatus = statusMapping[applicationStatus] || applicationStatus;
    const documentStatusColourMapping =
      statusColourMapping[applicationStatus] || applicationStatus;

    if (!validationResult.isValid) {
      const errors = {};
      const errorSummary = [];

      validationResult.errors.forEach((err) => {
        const fieldId = err.path.join("_");
        const message = err.message;

        // Only process microchipNumber errors if the checkbox is selected
        if (
          fieldId === "mcNotMatchActual" &&
          payload.mcNotMatch !== "true"
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
        const responseData = await saveReportNonCompliance(payload, data);
        if (responseData?.error) {
          //const errorMessage = errorMessages.serviceError.message;
          return h.view(VIEW_PATH, {
            //error: errorMessage,
            errorSummary: [
              {
                fieldId: "unexpected",
                message: genericErrorMessage,
                dispalyAs: "text",
              },
            ],
            documentStatus,
            documentStatusColourMapping,
            data,
            model,
            formSubmitted: true,
            payload,
          });
        }
    }

    request.yar.clear("IsFailSelected");
    
    // Clear individual keys
    request.yar.clear("routeId");
    request.yar.clear("routeName");
    request.yar.clear("departureDate");
    request.yar.clear("departureTime");
    request.yar.clear("checkSummaryId");

    // Redirect to the dashboard
    request.yar.set("successConfirmation", true);

    return h.redirect("/checker/dashboard");
  } catch (error) {
    console.error("Unexpected Error:", error);

    const data = request.yar.get("data");
    const appSettings = await appSettingsService.getAppSettings();
    const model = { ...appSettings };
    const applicationStatus = data.documentState.toLowerCase().trim();
    const documentStatus = statusMapping[applicationStatus] || applicationStatus;
    const documentStatusColourMapping =
      statusColourMapping[applicationStatus] || applicationStatus;

    return h.view(VIEW_PATH, {
      documentStatus,
      documentStatusColourMapping,
      data,
      model,
      errorSummary: [
        {
          fieldId: "unexpected",
          message: genericErrorMessage,
          dispalyAs: "text",
        },
      ],
      formSubmitted: true,
      errors: {},
      payload: request.payload,
    });
  }

  async function saveReportNonCompliance(payload, data) {
    try{    
    const isGBCheck = request.yar.get("isGBCheck");
    let { dateTimeString, routeId, routeOptionId, flightNumber } = getJourneyDetails(request, isGBCheck);

    // Call the helper function to create the checkOutcome object
    const checkerId = request.yar.get("checkerId");
    const gbcheckSummaryId = request.yar.get("checkSummaryId");

    const checkOutcome = createCheckOutcome(
      data,
      payload,
      isGBCheck,
      dateTimeString,
      checkerId,
      gbcheckSummaryId,
      routeId,
      routeOptionId,
      flightNumber
    );

    const responseData = await apiService.reportNonCompliance(
      checkOutcome,
      request
    );

    return responseData;
  } catch (error) {
    console.error("Error fetching data:", error.message);

    // Check for specific error message and return a structured error
    return { error: genericErrorMessage };
  }
  }

  function toBooleanOrNull(value, defaultValue) {
    return value === "true" ? true : defaultValue;
  }

  // Helper function to safely get a payload property or null
  function getPayloadValue(payload, key) {
    const value = payload?.[key];
    return value === '' ? null : value ?? null;
  }

  // Refactor checkOutcome construction
  function createCheckOutcome(
    data,
    payload,
    isGBCheck,
    dateTimeString,
    checkerId,
    gbcheckSummaryId,
    routeId,
    routeOptionId,
    flightNumber
  ) {
    return {
      applicationId: data.applicationId,
      checkOutcome: CheckOutcomeConstants.Fail,
      checkerId: checkerId ?? null,
      routeId: routeId,
      sailingTime: dateTimeString,
      sailingOption: routeOptionId,
      flightNumber: flightNumber,
      isGBCheck: isGBCheck,
      mcNotMatch: toBooleanOrNull(payload?.mcNotMatch, null),
      mcNotMatchActual: getPayloadValue(payload, "mcNotMatchActual"),
      mcNotFound: toBooleanOrNull(payload?.mcNotFound, null),
      vcNotMatchPTD: toBooleanOrNull(payload?.vcNotMatchPTD),
      oiFailPotentialCommercial: toBooleanOrNull(payload?.oiFailPotentialCommercial, null),
      oiFailAuthTravellerNoConfirmation: toBooleanOrNull(payload?.oiFailAuthTravellerNoConfirmation, null),
      oiFailOther: toBooleanOrNull(payload?.oiFailOther, null),
      passengerTypeId: getPayloadValue(payload, "passengerType"),
      relevantComments: getPayloadValue(payload, "relevantComments"),
      gbRefersToDAERAOrSPS: toBooleanOrNull(payload?.gbRefersToDAERAOrSPS, null),
      gbAdviseNoTravel: toBooleanOrNull(payload?.gbAdviseNoTravel, null),
      gbPassengerSaysNoTravel: toBooleanOrNull(payload?.gbPassengerSaysNoTravel, null),
      spsOutcome: toBooleanOrNull(payload?.spsOutcome, isGBCheck? null: false),
      spsOutcomeDetails: getPayloadValue(payload, "spsOutcomeDetails"),
      gBCheckId: gbcheckSummaryId ?? null,
    };
  }

  function getJourneyDetails(request, isGBCheck) {
    //Pass Journey Details from Session Stored in Header "currentSailingSlot"
    const currentSailingSlot = request.yar.get("currentSailingSlot") || {};
    let currentDate = currentSailingSlot.departureDate
      .split("/")
      .reverse()
      .join("-");
    let dateTimeString = `${currentDate}T${currentSailingSlot.sailingHour}:${currentSailingSlot.sailingMinutes}:00Z`;
  
    let routeId = currentSailingSlot?.selectedRoute?.id ?? null;
    let routeOptionId = currentSailingSlot.selectedRouteOption.id;
    let flightNumber = currentSailingSlot.routeFlight || null;
    
    //When Approval is of Type NI and RouteOption selected is of Type Ferry then
    //Pass Journey details by extracting from specific table as opposed to Session Stored in Header "currentSailingSlot"
    if(!isGBCheck && routeOptionId === CurrentSailingRouteOptions[0].id)
    {
       routeId = request.yar.get("routeId");
       let gbCheckCurrentDate = request.yar.get("departureDate");
       currentDate = gbCheckCurrentDate
          .split("/")
          .reverse()
          .join("-");

       let gbDepartureTime = request.yar.get("departureTime");
       const sailingHour = gbDepartureTime.split(":")[0];
       const sailingMinutes = gbDepartureTime.split(":")[1];

       dateTimeString = `${currentDate}T${sailingHour}:${sailingMinutes}:00Z`;
    }

    return { dateTimeString, routeId, routeOptionId, flightNumber };
  }
};

export const NonComplianceHandlers = {
  getNonComplianceHandler,
  postNonComplianceHandler,
};



