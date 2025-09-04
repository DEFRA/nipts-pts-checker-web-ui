"use strict";
import { validateUpdateReferralForm } from "./validate.js";
import apiService from "../../../../api/services/apiService.js";
import { getJourneyDetails, createCheckOutcome, updateNonComplianceYarSessions, formatPTDNumber } from "../../../helper/nonComplinaceHelper.js";

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
      request,
      { dopostCall: false }
  );

  if (reference.startsWith("GB")) {
      applicationData.PTDNumberFormatted = formatPTDNumber(reference);
    }

  applicationData.documentStatusColourMapping =
    statusColourMapping[applicationData.documentState];

  applicationData.status = statusMapping[applicationData.documentState];

  request.yar.set("data", applicationData);

  return h.view(VIEW_PATH, { 
    applicationData,     
    errors: {},
    errorSummary: [],
    formSubmitted: false, 
    payload: {},});
};



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
       


        const data = request.yar.get("data"); 
        
        const travelUnderFramework = request.payload.travelUnderFramework;
        const isFail = travelUnderFramework === 'no';
        request.yar.set("IsFailSelected", isFail);
   
        data.ptdFormatted = formatPTDNumber(data.ptdNumber);
        data.isGBCheck = request.yar.get("isGBCheck");

        if (request.yar.get("IsFailSelected")) {
          data.spsOutcome = false;
        }

        else {
          data.spsOutcome = true;
        }

        await saveReportNonCompliance(payload, data);


        updateNonComplianceYarSessions(request);
        request.yar.clear("passengerTypeId");

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
        const checkOutcome = createCheckOutcome(
          request, 
          context          
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
};



export const UpdateReferralHandler = {
  getUpdateReferralForm,
  postUpdateReferralForm,
};
