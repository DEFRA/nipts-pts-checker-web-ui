"use strict";
import apiService from "../../../../api/services/apiService.js";

const VIEW_PATH = "componentViews/checker/updateReferral/updateReferralView";


const getUpdateReferralForm = async (request, h) => {

 const {
        reference
  } = request.payload;

  const applicationData = await apiService.getApplicationByPTDNumber(
      reference,
      request
  );

  if (reference.startsWith("GB")) {
      applicationData.PTDNumberFormatted = formatPTDNumber(reference);
    }

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
  /*const { CheckSummaryId, PTDNumber, ApplicationNumber } = request.payload;

  const identifier = PTDNumber || ApplicationNumber;
  if (identifier) {
    request.yar.set("identifier", identifier);
  }

  request.yar.set("checkSummaryId", CheckSummaryId);
*/
  return h.redirect("/checker/dashboard");
};




export const UpdateReferralHandler = {
  getUpdateReferralForm,
  postUpdateReferralForm,
};
