"use strict";

import documentSearchMainService from "../../../../api/services/documentSearchMainService.js";
import apiService from "../../../../api/services/apiService.js";
import microchipApi from "../../../../api/services/microchipAppPtdMainService.js";
import {
  validatePtdNumber,
  validateApplicationNumber,
  validateMicrochipNumber,
} from "./validate.js";

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
        return h.view(VIEW_PATH, {
          error: "Failed to fetch document search data",
        });
      }
    },
  },
};

const submitSearch = async (request, h) => {
  var searchText = "";
  try {
    const { documentSearch, microchipNumber } = request.payload;

    // Search by PTD Number
    if (documentSearch === "ptd") {
      searchText = request.payload.ptdNumberSearch;
      const validationResult = validatePtdNumber(
        request.payload.ptdNumberSearch
      );
      if (!validationResult.isValid) {
        return h.view(VIEW_PATH, {
          error: validationResult.error,
          errorSummary: [
            { fieldId: "ptdNumberSearch", message: validationResult.error },
          ],
          activeTab: "ptd",
          formSubmitted: true,
          documentSearchMainModelData:
            await documentSearchMainService.getDocumentSearchMain(searchText),
        });
      }

      const ptdNumber = `GB826${request.payload.ptdNumberSearch}`;
      const response = await apiService.getApplicationByPTDNumber(ptdNumber);

      if (response.data) {
        request.yar.set("ptdNumber", microchipNumber);

        let statusName = response.data.status.toLowerCase();
        if (statusName === "authorised") {
          statusName = "approved";
        } else if (statusName === "awaiting verification") {
          statusName = "awaiting";
        } else if (statusName === "rejected") {
          statusName = "revoked";
        }

        const resultData = {
          documentState: statusName,
          ptdNumber: response.data.ptdNumber,
        };

        request.yar.set("data", resultData);
      } else {
        if (response.status === 404) {
          return h.redirect("/application-not-found");
        } else {
          return h.view(VIEW_PATH, {
            error: response.error,
            errorSummary: [
              { fieldId: "ptdNumberSearch", message: response.error },
            ],
            activeTab: "ptd",
            formSubmitted: true,
            documentSearchMainModelData:
              await documentSearchMainService.getDocumentSearchMain(searchText),
          });
        }
      }

      return h.redirect("/checker/search-results");
    }

    // Search by Application Number
    if (documentSearch === "application") {
      searchText = request.payload.applicationNumberSearch;

      const validationResult = validateApplicationNumber(
        request.payload.applicationNumberSearch
      );

      if (!validationResult.isValid) {
        return h.view(VIEW_PATH, {
          error: validationResult.error,
          errorSummary: [
            {
              fieldId: "applicationNumberSearch",
              message: validationResult.error,
            },
          ],
          activeTab: "application",
          formSubmitted: true,
          documentSearchMainModelData:
            await documentSearchMainService.getDocumentSearchMain(searchText),
        });
      }

      const response = await apiService.getApplicationByApplicationNumber(
        request.payload.applicationNumberSearch
      );

      if (response.data) {
        request.yar.set("applicationNumber", microchipNumber);

        let statusName = response.data.status.toLowerCase();
        if (statusName === "authorised") {
          statusName = "approved";
        } else if (statusName === "awaiting verification") {
          statusName = "awaiting";
        } else if (statusName === "rejected") {
          statusName = "revoked";
        }

        const resultData = {
          documentState: statusName,
          applicationNumber: response.data.applicationNumber,
        };

        request.yar.set("data", resultData);
      } else {
        if (response.status === 404) {
          return h.redirect("/application-not-found");
        } else {
          return h.view(VIEW_PATH, {
            error: response.error,
            errorSummary: [
              { fieldId: "applicationNumberSearch", message: response.error },
            ],
            activeTab: "application",
            formSubmitted: true,
            documentSearchMainModelData:
              await documentSearchMainService.getDocumentSearchMain(searchText),
          });
        }
      }

      return h.redirect("/checker/search-results");
    }

    // Search by Microchip Number
    if (documentSearch === "microchip") {
      searchText = microchipNumber;

      const validationResult = validateMicrochipNumber(microchipNumber);
      if (!validationResult.isValid) {
        return h.view(VIEW_PATH, {
          error: validationResult.error,
          errorSummary: [
            { fieldId: "microchipNumber", message: validationResult.error },
          ],
          activeTab: "microchip",
          formSubmitted: true,
          documentSearchMainModelData:
            await documentSearchMainService.getDocumentSearchMain(searchText),
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
            errorSummary: [
              {
                fieldId: "microchipNumber",
                message: microchipAppPtdMainData.error,
              },
            ],
            activeTab: "microchip",
            formSubmitted: true,
            documentSearchMainModelData:
              await documentSearchMainService.getDocumentSearchMain(searchText),
          });
        }
      }

      request.yar.set("microchipNumber", microchipNumber);
      request.yar.set("data", microchipAppPtdMainData);

      return h.redirect("/checker/search-results");
    }

    return h.redirect("/checker/search-results");
  } catch (error) {
    return h.view(VIEW_PATH, {
      error: "An error occurred while processing your request",
      errorSummary: [
        { fieldId: "general", message: "An unexpected error occurred" },
      ],
      formSubmitted: true,
      documentSearchMainModelData:
        await documentSearchMainService.getDocumentSearchMain(searchText),
    });
  }
};

export const DocumentSearchHandlers = {
  getDocumentSearch,
  submitSearch,
};
