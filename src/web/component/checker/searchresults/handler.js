"use strict";
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
  const microchipNumber = request.yar.get("microchipNumber");
  const data = request.yar.get("data");

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
  return h.view(VIEW_PATH, { microchipNumber, data, pageTitle, checklist });
};

const handleValidationError = (request, h, validationResult) => {
  const microchipNumber = request.yar.get("microchipNumber");
  const data = request.yar.get("data");
  const pageTitle = DashboardMainModel.dashboardMainModelData.pageTitle;

  data.ptdFormatted = data?.ptdNumber ? formatPtdNumber(data.ptdNumber) : "";

  return h.view(VIEW_PATH, {
    error: validationResult.error,
    errorSummary: [{ fieldId: "checklist", message: validationResult.error }],
    microchipNumber,
    data,
    pageTitle,
    formSubmitted: true,
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

    if (checklist === CheckOutcomeConstants.Pass) {
      const checkOutcome = prepareCheckOutcome(request, data, checklist);
      const responseData = await apiService.recordCheckOutCome(
        checkOutcome,
        request
      );

      if (responseData?.error) {
        return handleApiError(request, h, checklist);
      }

      request.yar.clear("IsFailSelected");
      request.yar.clear("routeId");
      request.yar.clear("routeName");
      request.yar.clear("departureDate");
      request.yar.clear("departureTime");
      request.yar.clear("checkSummaryId");
      request.yar.set("successConfirmation", true);
      return h.redirect("/checker/dashboard");
    }

    request.yar.set("IsFailSelected", true);
    return h.redirect("/checker/non-compliance");
  } catch (error) {
    return h.view(VIEW_PATH, {
      error: "An error occurred while processing your request",
      errorSummary: [
        { fieldId: "general", message: "An unexpected error occurred" },
      ],
    });
  }
};

export const SearchResultsHandlers = {
  getSearchResultsHandler,
  saveAndContinueHandler,
};
