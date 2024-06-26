"use strict";

const VIEW_PATH = "componentViews/checker/searchresults/searchResultsView";

const getSearchResultsHandler = {
  index: {
    plugins: {
      "hapi-auth-cookie": {
        redirectTo: false,
      },
    },
    handler: async (request, h) => {
      const microchipNumber = request.yar.get("microchipNumber");
      const data = request.yar.get("data");
      return h.view(VIEW_PATH, { microchipNumber, data });
    },
  },
};

const saveAndContinueHandler = async (request, h) => {
  try {
    const { checklist } = request.payload;    
    if (checklist === "pass") {
      
      return h.redirect("/checker/document-search");
    }

    return h.redirect("/checker/reports");
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
