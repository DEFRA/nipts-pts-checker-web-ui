"use strict";

import appSettingsService from "../../../../api/services/appSettingsService.js";
import { validateNonCompliance } from "./validate.js";
import { CheckOutcomeConstants } from "../../../../constants/checkOutcomeConstant.js";
import errorMessages from "./errorMessages.js";
import apiService from "../../../../api/services/apiService.js";

const VIEW_PATH = "componentViews/checker/noncompliance/noncomplianceView";

const genericErrorMessage = "The information wasn't recorded, please try to submit again. If you close the application, the information will be lost. You can printscreen or save the information and submit it later.";

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

    if (request.yar.get("IsFailSelected")) {
      setNonComplianceSession(payload);

      try {
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
            data,
            model,
            formSubmitted: true,
            payload,
          });
        }
      } catch (err) {
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
          data,
          model,
          formSubmitted: true,
          payload,
        });
      }
    }

    request.yar.set("IsFailSelected", false);
    // Redirect to the dashboard
    request.yar.set("successConfirmation", true);
    return h.redirect("/checker/dashboard");
  } catch (error) {
    console.error("Unexpected Error:", error);

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
          dispalyAs: "text",
        },
      ],
      formSubmitted: true,
      errors: {},
      payload: request.payload,
    });
  }

  async function saveReportNonCompliance(payload, data) {
    const currentSailingSlot = request.yar.get("CurrentSailingSlot") || {};
    const currentDate = currentSailingSlot.departureDate
      .split("/")
      .reverse()
      .join("-");
    const dateTimeString = `${currentDate}T${currentSailingSlot.sailingHour}:${currentSailingSlot.sailingMinutes}:00Z`;

    //TODO need to get GB/SPS check basing on Org ID and set
    //isGBCheck, checkerId
    const isGBCheck = true;
    if (isGBCheck) {
      payload.spsOutcome = null;
      payload.spsOutcomeDetails = null;
    } else {
      payload.gbRefersToDAERAOrSPS = null;
      payload.gbAdviseNoTravel = null;
      payload.gbPassengerSaysNoTravel = null;
    }

    // Call the helper function to create the checkOutcome object
    const checkerId = request.yar.get("checkerId");
    const checkOutcome = createCheckOutcome(
      data,
      payload,
      currentSailingSlot,
      isGBCheck,
      dateTimeString,
      checkerId
    );

    const responseData = await apiService.reportNonCompliance(
      checkOutcome,
      request
    );

    return responseData;
  }

  function toBooleanOrNull(value) {
    return value === "true" ? true : null;
  }

  // Helper function to safely get a payload property or null
  function getPayloadValue(payload, key) {
    return payload?.[key] ?? null;
  }

  // Refactor checkOutcome construction
  function createCheckOutcome(
    data,
    payload,
    currentSailingSlot,
    isGBCheck,
    dateTimeString,
    checkerId
  ) {
    return {
      applicationId: data.applicationId,
      checkOutcome: CheckOutcomeConstants.Fail,
      checkerId: checkerId ?? null,
      routeId: currentSailingSlot?.selectedRoute?.id ?? null,
      sailingTime: dateTimeString,
      sailingOption: currentSailingSlot.selectedRouteOption.id,
      flightNumber: currentSailingSlot.routeFlight || null,
      isGBCheck: isGBCheck,
      mcNotMatch: toBooleanOrNull(payload?.mcNotMatch),
      mcNotMatchActual: getPayloadValue(payload, "mcNotMatchActual"),
      mcNotFound: toBooleanOrNull(payload?.mcNotFound),
      vcNotMatchPTD: toBooleanOrNull(payload?.vcNotMatchPTD),
      oiFailPotentialCommercial: toBooleanOrNull(
        payload?.oiFailPotentialCommercial
      ),
      oiFailAuthTravellerNoConfirmation: toBooleanOrNull(
        payload?.oiFailAuthTravellerNoConfirmation
      ),
      oiFailOther: toBooleanOrNull(payload?.oiFailOther),
      passengerTypeId: getPayloadValue(payload, "passengerType"),
      relevantComments: getPayloadValue(payload, "relevantComments"),
      gbRefersToDAERAOrSPS: toBooleanOrNull(payload?.gbRefersToDAERAOrSPS),
      gbAdviseNoTravel: toBooleanOrNull(payload?.gbAdviseNoTravel),
      gbPassengerSaysNoTravel: toBooleanOrNull(
        payload?.gbPassengerSaysNoTravel
      ),
      spsOutcome: getPayloadValue(payload, "spsOutcome"),
      spsOutcomeDetails: getPayloadValue(payload, "spsOutcomeDetails"),
    };
  }

  function setNonComplianceSession(payload) {
    const reportNoncomplianceData =
      request.yar.get("reportNoncomplianceData") || [];
    // Proceed with further logic if validation passes
    if (payload.mcNotMatch === "true") {
      reportNoncomplianceData["mcNotMatch"] = payload.mcNotMatch;
      reportNoncomplianceData["mcNotMatchActual"] = payload.mcNotMatchActual;
    }

    if (payload.vcNotMatchPTD === "true") {
      reportNoncomplianceData["vcNotMatchPTD"] = payload.vcNotMatchPTD;
    }

    if (payload.oiFailPotentialCommercial === "true") {
      reportNoncomplianceData["oiFailPotentialCommercial"] =
        payload.oiFailPotentialCommercial;
    }

    if (payload.oiFailAuthTravellerNoConfirmation === "true") {
      reportNoncomplianceData["oiFailAuthTravellerNoConfirmation"] =
        payload.oiFailAuthTravellerNoConfirmation;
    }

    if (payload.oiFailOther === "true") {
      reportNoncomplianceData["oiFailOther"] = payload.oiFailOther;
    }

    // Proceed with further logic if validation passes
    if (payload.relevantComments.length > 0) {
      reportNoncomplianceData["relevantComments"] = payload.relevantComments;
    }

    reportNoncomplianceData["passengerType"] = payload.passengerType;

    reportNoncomplianceData["gbRefersToDAERAOrSPS"] =
      payload.gbRefersToDAERAOrSPS;
    reportNoncomplianceData["gbAdviseNoTravel"] = payload.gbAdviseNoTravel;
    reportNoncomplianceData["gbPassengerSaysNoTravel"] =
      payload.gbPassengerSaysNoTravel;

    reportNoncomplianceData["spsOutcome"] = payload.spsOutcome;
    reportNoncomplianceData["spsOutcomeDetails"] = payload.spsOutcomeDetails;

    request.yar.set("reportNoncomplianceData", reportNoncomplianceData);
  }
};

export const NonComplianceHandlers = {
  getNonComplianceHandler,
  postNonComplianceHandler,
};
