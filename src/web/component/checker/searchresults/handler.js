"use strict";
import DashboardMainModel from "../../../../constants/dashBoardConstant.js";
import apiService from "../../../../api/services/apiService.js";
import errorMessages from "./errorMessage.js";
import { CheckOutcomeConstants } from "../../../../constants/checkOutcomeConstant.js";
import {
  validatePassOrFail,
} from "./validate.js";

const VIEW_PATH = "componentViews/checker/searchresults/searchResultsView";

const getSearchResultsHandler = async (request, h) => {
  const microchipNumber = request.yar.get("microchipNumber");
  const data = request.yar.get("data");
  const pageTitle = DashboardMainModel.dashboardMainModelData.pageTitle;
  return h.view(VIEW_PATH, { microchipNumber, data, pageTitle });
};

const saveAndContinueHandler = async (request, h) => {
  try {
    let { checklist } = request.payload;

    const data = request.yar.get("data");
    if (data.documentState === "rejected" || data.documentState === "revoked") {
      checklist = CheckOutcomeConstants.Fail;
    }

    const validationResult = validatePassOrFail(checklist);
    if (!validationResult.isValid) {
      const microchipNumber = request.yar.get("microchipNumber");
      const data = request.yar.get("data");
      const pageTitle = DashboardMainModel.dashboardMainModelData.pageTitle;
      return h.view(VIEW_PATH, {
        error: validationResult.error,
        errorSummary: [
          { fieldId: "checklist", message: validationResult.error },
        ],
        microchipNumber, 
        data, 
        pageTitle,
        formSubmitted: true,
      });
    }

    const currentSailingSlot = request.yar.get("CurrentSailingSlot") || {};
    let currentDate = new Date()
      .toLocaleDateString("en-GB")
      .split("/")
      .reverse()
      .join("-");
    let dateTimeString = `${currentDate}T${currentSailingSlot.sailingHour}:${currentSailingSlot.sailingMinutes}:00Z`;

    const checkOutcome = {
      applicationId: data.applicationId,
      checkOutcome: checklist,
      checkerId: null,
      routeId: currentSailingSlot.selectedRoute.id,
      sailingTime: dateTimeString,
    };

    const responseData = await apiService.recordCheckOutCome(
      checkOutcome,
      request
    );
    if (responseData.error) {
      const errorMessage = errorMessages.serviceError.message;
      const microchipNumber = request.yar.get("microchipNumber");
      const data = request.yar.get("data");
      const pageTitle = DashboardMainModel.dashboardMainModelData.pageTitle;
      return h.view(VIEW_PATH, 
        { 
          error: errorMessage,
          errorSummary: [
          {
            fieldId: "unexpected",
            message: errorMessages.serviceError.message,
          },
        ],
          microchipNumber, 
          data, 
          pageTitle,
          formSubmitted: true 
        });
    }

    if (checklist === CheckOutcomeConstants.Pass) {
      request.yar.set("successConfirmation", true);
      return h.redirect("/checker/document-search");
    }

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
