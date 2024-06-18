"use strict";

import documentSearchMainService from "../../../../api/services/documentSearchMainService.js";
import apiService from "../../../../api/services/apiService.js";

const VIEW_PATH = "componentViews/checker/documentsearch/documentSearchView";

const getDocumentSearch = {
  index: {
    plugins: {
      "hapi-auth-cookie": {
        redirectTo: false,
      },
    },
    handler: async (request, h) => {
      const documentSearchMainModelData = await documentSearchMainService.getDocumentSearchMain();
      return h.view(VIEW_PATH, { documentSearchMainModelData });
    },
  },
};

const submitDocumentSearch = async (request, h) => {
  //  request.yar.set("formData", formData);

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

export const DocumentSearchHandlers = {
  getDocumentSearch,
  submitDocumentSearch,
};
