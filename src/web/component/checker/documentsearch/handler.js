"use strict";

import documentSearchMainService from "../../../../api/services/documentSearchMainService.js";
import apiService from "../../../../api/services/apiService.js";
import microchipApi from "../../../../api/services/microchipAppPtdMainService.js";

const VIEW_PATH = "componentViews/checker/documentsearch/documentSearchView";

const getDocumentSearch = {
  index: {
    plugins: {
      "hapi-auth-cookie": {
        redirectTo: false,
      },
    },
    handler: async (_request, h) => {
      try {
        const documentSearchMainModelData =
          await documentSearchMainService.getDocumentSearchMain();
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

  let redirectUrl = "/checker/dashboard";

  if (request.payload.documentSearch === "ptd") {
    const ptdNumber = `GB826${request.payload.ptdNumberSearch}`;
    const response = await apiService.getApplicationByPTDNumber(ptdNumber);
    if (response.data) {
      const status = response.data.status ?? "";
      switch (status.toUpperCase()) {
        case "AUTHORIZED":
        case "AUTHORISED":
        case "APPROVED":
          redirectUrl = `/checker/approved?ptdNumber=${ptdNumber}`;
          break;
        case "REVOKED":
        case "CANCELLED":
          redirectUrl = `/checker/revoked?ptdNumber=${ptdNumber}`;
          break;
        default:
          redirectUrl = `/not-found?ptdNumber=${ptdNumber}`;
          break;
      }
    }
  }

  return h
    .response({
      status: "success",
      message: "Search form submitted successfully",
      redirectTo: redirectUrl,
    })
    .code(200);
};

    if (documentSearch === "microchip") {
      if (!microchipNumber) {
        return h.view(VIEW_PATH, {
          error: "Enter a microchip number",
          errorSummary: "There is a problem - Enter a microchip number",
          activeTab: "microchip",
          documentSearchMainModelData:
            await documentSearchMainService.getDocumentSearchMain(),
        });
      }
      if (!/^\d{15}$/.test(microchipNumber)) {
        return h.view(VIEW_PATH, {
          error: "Enter a 15-digit number",
          errorSummary: "There is a problem - Enter a 15-digit number",
          activeTab: "microchip",
          documentSearchMainModelData:
            await documentSearchMainService.getDocumentSearchMain(),
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
            documentSearchMainModelData:
              await documentSearchMainService.getDocumentSearchMain(),
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
      documentSearchMainModelData:
        await documentSearchMainService.getDocumentSearchMain(),
    });
  }
};

export const DocumentSearchHandlers = {
  getDocumentSearch,
  submitSearch,
};
