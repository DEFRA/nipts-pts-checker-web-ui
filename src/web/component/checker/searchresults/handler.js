"use strict";
import DashboardMainModel from "../../../../constants/dashBoardConstant.js";

const VIEW_PATH = "componentViews/checker/searchresults/searchResultsView";


const getSearchResultsHandler = 
  async (request, h) => {
    const microchipNumber = request.yar.get("microchipNumber");
    const data = request.yar.get("data");
    const pageTitle = DashboardMainModel.dashboardMainModelData.pageTitle;
    return h.view(VIEW_PATH, { microchipNumber, data, pageTitle });
  };

const saveAndContinueHandler = async (request, h) => {
  try {
    const { checklist } = request.payload;
    if (checklist === "pass") {
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
