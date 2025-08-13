"use strict";
import apiService from "../../../../api/services/apiService.js";
import { CheckOutcomeConstants } from "../../../../constants/checkOutcomeConstant.js";
import { CurrentSailingRouteOptions } from "../../../../constants/currentSailingConstant.js";
import {
  validateOutcomeRadio,
  validateOutcomeReason
} from "./validate.js";

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

const getPtdFormatted = (data) => {
  const PTD_LENGTH = 11; 
  const PTD_PREFIX_LENGTH = 5;
  const PTD_MID_LENGTH = 8;

  return data?.ptdNumber 
    ? `${data.ptdNumber.padStart(PTD_LENGTH, '0').slice(0, PTD_PREFIX_LENGTH)} ` +
      `${data.ptdNumber.padStart(PTD_LENGTH, '0').slice(PTD_PREFIX_LENGTH, PTD_MID_LENGTH)} ` +
      `${data.ptdNumber.padStart(PTD_LENGTH, '0').slice(PTD_MID_LENGTH)}`
    : "";
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
        const {
              travelUnderFramework,
              detailsOfOutcome,
              PTDNumberFormatted,
              issuedDate,
              status, 
              microchipNumber,
              petSpecies,
              documentStatusColourMapping,
            } = payload;

        const validation = validateUpdateReferralForm(PTDNumberFormatted, issuedDate, status, microchipNumber, petSpecies, documentStatusColourMapping, travelUnderFramework, detailsOfOutcome);
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
        payload.spsOutcome = travelUnderFramework === "yes" ? "true" : "false";
        payload.spsOutcomeDetails = payload.detailsOfOutcome;
        payload.passengerType =  request.yar.get("passengerTypeId");    
        const data = request.yar.get("data");    
        data.ptdFormatted = getPtdFormatted(data);
        data.isGBCheck = request.yar.get("isGBCheck");

        if (request.yar.get("IsFailSelected")) {
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
        const { dateTimeString, routeId, routeOptionId, flightNumber } = getJourneyDetails(isGBCheck);
    
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
  
    function validateUpdateReferralForm(PTDNumberFormatted, issuedDate, status, microchipNumber, petSpecies, documentStatusColourMapping, travelUnderFramework, detailsOfOutcome) {  
      const errorSummary = [];
      let errorSummaryMessage;
      let isValid = true;
      const applicationData = {PTDNumberFormatted, issuedDate, status, microchipNumber, petSpecies, documentStatusColourMapping, travelUnderFramework, detailsOfOutcome};
      
    
      const validationResultRadio = validateOutcomeRadio(travelUnderFramework);
      const validationResultText = validateOutcomeReason(detailsOfOutcome);
    
      if (!validationResultRadio.isValid) {
          errorSummaryMessage = validationResultRadio.error;
          isValid = false;
          errorSummary.push({
            fieldId: "outcomeRadio",
            message: errorSummaryMessage,
          });
      }
    
      if (!validationResultText.isValid) {
          errorSummaryMessage = validationResultText.error;
          isValid = false;
          errorSummary.push({
            fieldId: "detailsOfOutcome",
            message: errorSummaryMessage,
          });
      }
           
      return {
          isValid,
          errorSummary,
          applicationData,
          validationResultRadioError: validationResultRadio.error,
          validationResultTextError: validationResultText.error,
        };
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
  
    function getDefaultCurrentSailing() {
      return request.yar.get("currentSailingSlot") || {};
    }
  
    function getJourneyDetails(isGBCheck) {
      //Pass Journey Details from Session Stored in Header "currentSailingSlot"
      const currentSailingSlot = getDefaultCurrentSailing();
      let currentDate = currentSailingSlot.departureDate
        .split("/")
        .reverse()
        .join("-");
      
      let sailingHour = currentSailingSlot.sailingHour;
      let sailingMinutes = currentSailingSlot.sailingMinutes;
      let dateTimeString = `${currentDate}T${sailingHour}:${sailingMinutes}:00Z`;
    
      let routeId = currentSailingSlot?.selectedRoute?.id ?? null;
      const routeOptionId = currentSailingSlot.selectedRouteOption.id;
      const flightNumber = currentSailingSlot?.routeFlight ?? null;    
      if(routeOptionId === CurrentSailingRouteOptions[1].id)
      {
        request.yar.clear("checkSummaryId");
      }
  
      //When Approval is of Type NI and RouteOption selected is of Type Ferry
      //If Journey details are available by cliciking view link and selecting the GB referral on UI(this sets in session)
      //If available from view link and GB referral on UI session pass session values, 
      //else use the default currentsailings session[this covers search or scan route]
      if(!isGBCheck && routeOptionId === CurrentSailingRouteOptions[0].id)
      {
         const referredRouteId = request.yar.get("routeId");
         const referredCheckCurrentDate = request.yar.get("departureDate");
         const referreDepartureTime = request.yar.get("departureTime");
         const referredCheckSummaryId = request.yar.get("checkSummaryId");
  
         if(referredRouteId && referredCheckCurrentDate && referreDepartureTime && referredCheckSummaryId)
         {  
            routeId = referredRouteId;       
            currentDate = referredCheckCurrentDate
                .split("/")
                .reverse()
                .join("-");
            
            sailingHour = referreDepartureTime.split(":")[0];
            sailingMinutes = referreDepartureTime.split(":")[1];
         }
  
         dateTimeString = `${currentDate}T${sailingHour}:${sailingMinutes}:00Z`;
      }
  
      return { dateTimeString, routeId, routeOptionId, flightNumber };
    }
};



export const UpdateReferralHandler = {
  getUpdateReferralForm,
  postUpdateReferralForm,
};
