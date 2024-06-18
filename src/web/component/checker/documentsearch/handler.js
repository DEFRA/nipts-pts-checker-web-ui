"use strict";

import documentSearchMainService from "../../../../api/services/documentSearchMainService.js";
import apiService from "../../../../api/services/apiService.js";
import microchipApi from "../../../../api/services/microchipAppPtdMainService.js";

const VIEW_PATH = "componentViews/checker/documentsearch/documentSearchView";

function isPtdNumber(str) {
  // A-F, 0-9
  return /^[a-fA-F0-9]+$/.test(str);
}

let validationErros = [];

const validatePtdNumber = (ptdNumber) => {
  var result = {
    isValid: true,
    error: null,
  };

  // Mandatory
  if (!ptdNumber || ptdNumber.length === 0) {
    validationErros.
    result.isValid = false;
    result.error = "Enter a PTD number";
    return result;
  }

  // More or less than 6 characters
  if (ptdNumber.length !== 6) {
    result.isValid = false;
    result.error = "Enter 6 characters after 'GB826'";
    return result;
  }

  if (!isPtdNumber(ptdNumber)) {
    result.isValid = false;
    result.error =
      "Enter 6 characters after 'GB826', using only letters and numbers";
    return result;
  }

  return result;
};

const getDocumentSearch = {
  index: {
    plugins: {
      "hapi-auth-cookie": {
        redirectTo: false,
      },
    },
    handler: async (_request, h) => {
      try {
        const documentSearchMainModelData = await documentSearchMainService.getDocumentSearchMain();
        return h.view(VIEW_PATH, { documentSearchMainModelData });
      } catch (error) {
        console.error("Error fetching document search data:", error);
        return h.view(VIEW_PATH, {
          error: "Failed to fetch document search data",
        });
      }
    },
  },
};

const submitSearch = async (request, h) => {
  try {
    const { documentSearch, microchipNumber } = request.payload;

    // Search by PTD Number
    if (request.payload.documentSearch === "ptd") {
      const validationResult = validatePtdNumber(
        request.payload.ptdNumberSearch
      );
      if (!validationResult.isValid) {
        return h.view(VIEW_PATH, {
          error: validationResult.error,
          errorSummary: `There is a problem - ${validationResult.error}`,
          activeTab: "ptd",
          documentSearchMainModelData: await documentSearchMainService.getDocumentSearchMain(),
        });
      }

      const ptdNumber = `GB826${request.payload.ptdNumberSearch}`;
      const response = await apiService.getApplicationByPTDNumber(ptdNumber);
      if (response.data) {
        request.yar.set("ptdNumber", microchipNumber);
        request.yar.set("ptdData", response.data);
      } else {
        if (response.status === 404) {
          return h.redirect("/application-not-found");
        } else {
          return h.view(VIEW_PATH, {
            error: response.error,
            errorSummary: `There is a problem - ${response.error}`,
            activeTab: "ptd",
            documentSearchMainModelData: await documentSearchMainService.getDocumentSearchMain(),
          });
        }
      }

      return h.redirect("/checker/search-results");
    }

    // Search by Microchip Number
    if (documentSearch === "microchip") {
      if (!microchipNumber) {
        return h.view(VIEW_PATH, {
          error: "Enter a microchip number",
          errorSummary: "There is a problem - Enter a microchip number",
          activeTab: "microchip",
          documentSearchMainModelData: await documentSearchMainService.getDocumentSearchMain(),
        });
      }
      if (!/^\d{15}$/.test(microchipNumber)) {
        return h.view(VIEW_PATH, {
          error: "Enter a 15-digit number",
          errorSummary: "There is a problem - Enter a 15-digit number",
          activeTab: "microchip",
          documentSearchMainModelData: await documentSearchMainService.getDocumentSearchMain(),
        });
      }

      const microchipAppPtdMainData = await microchipApi.getMicrochipData(
        microchipNumber
      );

      if (microchipAppPtdMainData.error) {
        if (microchipAppPtdMainData.error === "not_found") {
          return h.redirect("/application-not-found");
        } else {
          return h.view(VIEW_PATH, {
            error: microchipAppPtdMainData.error,
            errorSummary: `There is a problem - ${microchipAppPtdMainData.error}`,
            activeTab: "microchip",
            documentSearchMainModelData: await documentSearchMainService.getDocumentSearchMain(),
          });
        }
      }

      request.yar.set("microchipNumber", microchipNumber);
      request.yar.set("data", microchipAppPtdMainData);

      return h.redirect("/checker/search-results");
    }

    return h.redirect("/checker/search-results");
  } catch (error) {
    console.error("Error processing search:", error);
    return h.view(VIEW_PATH, {
      error: "An error occurred while processing your request",
      errorSummary: "An unexpected error occurred",
      documentSearchMainModelData: await documentSearchMainService.getDocumentSearchMain(),
    });
  }
};

export const DocumentSearchHandlers = {
  getDocumentSearch,
  submitSearch,
};
