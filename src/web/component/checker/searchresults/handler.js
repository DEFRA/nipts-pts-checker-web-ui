"use strict";
import headerData from "../../../../web/helper/constants.js";
import DashboardMainModel from "../../../../constants/dashBoardConstant.js";
import apiService from "../../../../api/services/apiService.js";
import errorMessages from "./errorMessages.js";
import { CheckOutcomeConstants } from "../../../../constants/checkOutcomeConstant.js";
import { validatePassOrFail } from "./validate.js";

const VIEW_PATH = "componentViews/checker/searchresults/searchResultsView";
const PTD_LENGTH = 11;
const PTD_PREFIX_LENGTH = 5;
const PTD_MID_LENGTH = 8;

const formatPtdNumber = (ptdNumber) => {
  if (!ptdNumber) {
    return "";
  }

  return (
    `${ptdNumber.padStart(PTD_LENGTH, "0").slice(0, PTD_PREFIX_LENGTH)} ` +
    `${ptdNumber
      .padStart(PTD_LENGTH, "0")
      .slice(PTD_PREFIX_LENGTH, PTD_MID_LENGTH)} ` +
    `${ptdNumber.padStart(PTD_LENGTH, "0").slice(PTD_MID_LENGTH)}`
  );
};

const getSearchResultsHandler = async (request, h) => {
  return searchHandler(request, h);
};

const getScanResultsHandler = async (request, h) => {
  headerData.section = "scan";
  return searchHandler(request, h);
};


const handleValidationError = (request, h, validationResult) => {
  const microchipNumber = request.yar.get("microchipNumber");
  const data = request.yar.get("data");
  const isGBCheck = request.yar.get("isGBCheck");
  const pageTitle = DashboardMainModel.dashboardMainModelData.pageTitle;

  data.ptdFormatted = data?.ptdNumber ? formatPtdNumber(data.ptdNumber) : "";

  return h.view(VIEW_PATH, {
    error: validationResult.error,
    errorSummary: [{ fieldId: "checklist-pass", message: validationResult.error }],
    microchipNumber,
    data,
    pageTitle,
    formSubmitted: true,
    isGBCheck
  });
};

const handleApiError = (request, h, checklist) => {
  const errorMessage = errorMessages.serviceError.message;
  const microchipNumber = request.yar.get("microchipNumber");
  const data = request.yar.get("data");
  const pageTitle = DashboardMainModel.dashboardMainModelData.pageTitle;

  return h.view(VIEW_PATH, {
    error: errorMessage,
    errorSummary: [
      {
        fieldId: "unexpected",
        message: errorMessages.serviceError.message,
        dispalyAs: "text",
      },
    ],
    microchipNumber,
    data,
    pageTitle,
    formSubmitted: true,
    checklist,
  });
};

const prepareCheckOutcome = (request, data, checklist) => {
  const currentSailingSlot = request.yar.get("currentSailingSlot") || {};
  const currentDate = currentSailingSlot.departureDate
    .split("/")
    .reverse()
    .join("-");
  const dateTimeString = `${currentDate}T${currentSailingSlot.sailingHour}:${currentSailingSlot.sailingMinutes}:00Z`;

  const isGBCheck = request.yar.get("isGBCheck");
  const checkerId = request.yar.get("checkerId");

  return {
    applicationId: data.applicationId,
    checkOutcome: checklist,
    checkerId: checkerId,
    routeId: currentSailingSlot?.selectedRoute?.id ?? null,
    sailingTime: dateTimeString,
    sailingOption: currentSailingSlot.selectedRouteOption.id,
    flightNumber: currentSailingSlot.routeFlight || null,
    isGBCheck: isGBCheck,
  };
};

const saveAndContinueHandler = async (request, h) => {
  try {
    let { checklist } = request.payload;
    const data = request.yar.get("data");
  
    if (
      data.documentState === "rejected" ||
      data.documentState === "revoked" ||
      data.documentState === "awaiting"
    ) {
      checklist = CheckOutcomeConstants.Fail;
    }

    const validationResult = validatePassOrFail(checklist);
    if (!validationResult.isValid) {
      return handleValidationError(request, h, validationResult);
    }

    
    switch (checklist) {
      case CheckOutcomeConstants.Pass:
        return await handlePassOutcome(request, h, data, checklist);

      case CheckOutcomeConstants.IssueSUPTD:
        return await handleIssueSUPTDOutcome(request, h);

      case CheckOutcomeConstants.ReferToSPS:
        return await handleReferToSPSOutcome(request, h);

      case CheckOutcomeConstants.Fail:
        return await handleFailOutcome(request, h);

      default:
        throw new Error(`Unknown checklist outcome: ${checklist}`);
    }
  } catch (error) {
    global.appInsightsClient.trackException({ exception: error });
    return h.view(VIEW_PATH, {
      error: "An error occurred while processing your request",
      errorSummary: [
        { fieldId: "general", message: "An unexpected error occurred" },
      ],
    });
  }
};


const handlePassOutcome = async (request, h, data, checklist) => {
  const checkOutcome = prepareCheckOutcome(request, data, checklist);
  const responseData = await apiService.recordCheckOutCome(
    checkOutcome,
    request
  );

  if (responseData?.error) {
    return handleApiError(request, h, checklist);
  }

  clearSessionAndRedirect(request);
  request.yar.set("successConfirmation", true);
  return h.redirect("/checker/dashboard");
};

const handleIssueSUPTDOutcome = async (request, h) => {
  
  clearSessionAndRedirect(request);
  request.yar.set("successConfirmation", true);
  return h.redirect("/checker/dashboard");
};

const handleReferToSPSOutcome = async (request, h) => {
 
  request.yar.set("IsFailSelected", true);
  return h.redirect("/checker/non-compliance");
};

const handleFailOutcome = async (request, h) => {
  request.yar.set("IsFailSelected", true);
  return h.redirect("/checker/non-compliance");
};

const clearSessionAndRedirect = (request) => {
  request.yar.clear("IsFailSelected");
  request.yar.clear("routeId");
  request.yar.clear("routeName");
  request.yar.clear("departureDate");
  request.yar.clear("departureTime");
  request.yar.clear("checkSummaryId");
};

const searchHandler = (request, h) => {
  const microchipNumber = request.yar.get("microchipNumber");
  const data = request.yar.get("data");
  const isGBCheck = request.yar.get("isGBCheck"); 

  data.ptdFormatted = data?.ptdNumber ? formatPtdNumber(data.ptdNumber) : "";

  const pageTitle = DashboardMainModel.dashboardMainModelData.pageTitle;
  let checklist = {};

  const nonComplianceToSearchResults = request.yar.get(
    "nonComplianceToSearchResults"
  );
  if (nonComplianceToSearchResults) {
    checklist = CheckOutcomeConstants.Fail;
    request.yar.clear("nonComplianceToSearchResults");
  }

  return h.view(VIEW_PATH, {
    microchipNumber,
    data,
    pageTitle,
    checklist,
    isGBCheck, 
  });
};

export const SearchResultsHandlers = {
  getSearchResultsHandler,
  getScanResultsHandler,
  saveAndContinueHandler,
};



