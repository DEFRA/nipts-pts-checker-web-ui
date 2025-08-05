"use strict";
import apiService from "../../../../api/services/apiService.js";

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

  applicationData.documentStatusColourMapping =
    statusColourMapping[applicationData.documentState];

    applicationData.Status = statusMapping[applicationData.documentState];

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

   const {
        travelUnderFramework,
        detailsOfOutcome
  } = request.payload;

  return h.redirect("/checker/dashboard");
};




export const UpdateReferralHandler = {
  getUpdateReferralForm,
  postUpdateReferralForm,
};
