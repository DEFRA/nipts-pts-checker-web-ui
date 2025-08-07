"use strict";
import apiService from "../../../../api/services/apiService.js";
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

  applicationData.status = statusMapping[applicationData.documentState];

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
        detailsOfOutcome,
        PTDNumberFormatted,
        issuedDate,
        status, 
        microchipNumber,
        petSpecies,
        documentStatusColourMapping
      } = request.payload;

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

    if (!isValid) {
    return h.view(VIEW_PATH, {
      applicationData,
      validationResultTextError: validationResultText.error,
      validationResultRadioError: validationResultRadio.error,
      formSubmitted: true,
      errorSummary,
    });
  }

  request.yar.set("successConfirmation", true);
  return h.redirect("/checker/dashboard");
};

export const UpdateReferralHandler = {
  getUpdateReferralForm,
  postUpdateReferralForm,
};
