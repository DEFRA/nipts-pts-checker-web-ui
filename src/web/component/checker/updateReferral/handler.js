"use strict";
import { validateUpdateReferralForm } from "./validate.js";
import apiService from "../../../../api/services/apiService.js";
import { CheckOutcomeConstants } from "../../../../constants/checkOutcomeConstant.js";
import { getJourneyDetails } from "../../../helper/nonComplinaceHelper.js";



const VIEW_PATH = "componentViews/checker/updateReferral/updateReferralView";

const statusColourMapping = {
  approved: "govuk-tag govuk-tag--green",
  awaiting: "govuk-tag govuk-tag--blue",
  revoked: "govuk-tag govuk-tag--red",
  rejected: "govuk-tag govuk-tag--red",
};

const statusMapping = {
  approved: "Approved",
  awaiting: "Pending",
  revoked: "Cancelled",
  rejected: "	Unsuccessful",
};


const getUpdateReferralForm = async (request, h) => {
const reference = request.yar.get("identifier");

  const applicationData = await apiService.getApplicationByPTDNumber(
      reference,
      request
  );

  if (reference.startsWith("GB")) {
      applicationData.PTDNumberFormatted = formatPTDNumber(reference);
    }

  applicationData.documentStatusColourMapping =
    statusColourMapping[applicationData.documentState];

  applicationData.status = statusMapping[applicationData.documentState];

  request.yar.set("data", applicationData);
  request.yar.set("IsFailSelected", true);
  return h.view(VIEW_PATH, { applicationData });
};

function formatPTDNumber(PTDNumber) {
  const PTD_LENGTH = 11;
  const PTD_PREFIX_LENGTH = 5;
  const PTD_MID_LENGTH = 8;

  return `${PTDNumber.padStart(PTD_LENGTH, "0").slice(0, PTD_PREFIX_LENGTH)} ` +
      `${PTDNumber.padStart(PTD_LENGTH, "0").slice(PTD_PREFIX_LENGTH, PTD_MID_LENGTH)} ` +
      `${PTDNumber.padStart(PTD_LENGTH, "0").slice(PTD_MID_LENGTH)}`;
}

const postUpdateReferralForm = async (request, h) => {
  try {
        const payload = request.payload; 
        const validation = validateUpdateReferralForm(payload);
        if (!validation.isValid) {
          return h.view(VIEW_PATH, {
            applicationData: validation.applicationData,
            validationResultTextError: validation.validationResultTextError,
            validationResultRadioError: validation.validationResultRadioError,
            formSubmitted: true,
            errorSummary: validation.errorSummary,
          });
        }

        payload.isGBCheck = request.yar.get("isGBCheck");
        payload.spsOutcome = payload.travelUnderFramework === "yes" ? "true" : "false";
        payload.spsOutcomeDetails = payload.detailsOfOutcome;
        payload.passengerType =  request.yar.get("passengerTypeId");    
       

        if (request.yar.get("IsFailSelected")) {
            const data = request.yar.get("data");    
            data.ptdFormatted = formatPTDNumber(data.ptdNumber);
            data.isGBCheck = request.yar.get("isGBCheck");
            await saveReportNonCompliance(payload, data);
        }

        request.yar.clear("IsFailSelected");
    
        // Clear individual keys
        request.yar.clear("routeId");
        request.yar.clear("routeName");
        request.yar.clear("departureDate");
        request.yar.clear("departureTime");
        request.yar.clear("checkSummaryId");
        request.yar.clear("passengerTypeId")

        // Redirect to the dashboard
        request.yar.set("successConfirmation", true);

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
    
        // Call the helper function to create the checkOutcome object
        const checkOutcome = createCheckOutcome(
          data,
          payload,
          isGBCheck,
          dateTimeString,
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
        global.appInsightsClient.trackException({ exception: error });
        console.error("Error fetching data:", error.message);
    
        throw error;
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
      routeId,
      routeOptionId,
      flightNumber
    ) {
      const checkerId = request.yar.get("checkerId");
      const gbcheckSummaryId = request.yar.get("checkSummaryId");
  
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
};



export const UpdateReferralHandler = {
  getUpdateReferralForm,
  postUpdateReferralForm,
};
