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
  try {
    const { documentSearch, microchipNumber } = request.payload;

    // Search by PTD Number
    if (documentSearch === "ptd") {
      const validationResult = validatePtdNumber(
        request.payload.ptdNumberSearch
      );
      if (!validationResult.isValid) {
        return h.view(VIEW_PATH, {
          error: validationResult.error,
          errorSummary: validationResult.error,
          activeTab: "ptd",
          documentSearchMainModelData:
            await documentSearchMainService.getDocumentSearchMain(),
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
            errorSummary: response.error,
            activeTab: "ptd",
            documentSearchMainModelData:
              await documentSearchMainService.getDocumentSearchMain(),
          });
        }
      }

      return h.redirect("/checker/search-results");
    }

       // Search by Application Number
    if (request.payload.documentSearch === "application") {
      const validationResult = validateApplicationNumber(
        request.payload.applicationNumberSearch
      );

      if (!validationResult.isValid) {
        return h.view(VIEW_PATH, {
          error: validationResult.error,
          errorSummary: `${validationResult.error}`,
          activeTab: "application",
          documentSearchMainModelData: await documentSearchMainService.getDocumentSearchMain(),
        });
      }
      
      const response = await apiService.getApplicationByApplicationNumber(request.payload.applicationNumberSearch);

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
          applicationNumber: response.data.applicationNumber 
        };

        request.yar.set("data", resultData);
      
      } else {
        if (response.status === 404) {
          return h.redirect("/application-not-found");
        } else {
          return h.view(VIEW_PATH, {
            error: response.error,
            errorSummary: `${response.error}`,
            activeTab: "ptd",
            documentSearchMainModelData:
              await documentSearchMainService.getDocumentSearchMain(),
          });
        }
      }

      return h.redirect("/checker/search-results");
    }

       // Search by Application Number
    if (request.payload.documentSearch === "application") {
      const validationResult = validateApplicationNumber(
        request.payload.applicationNumberSearch
      );

      if (!validationResult.isValid) {
        return h.view(VIEW_PATH, {
          error: validationResult.error,
          errorSummary: `${validationResult.error}`,
          activeTab: "application",
          documentSearchMainModelData: await documentSearchMainService.getDocumentSearchMain(),
        });
      }
      
      const response = await apiService.getApplicationByApplicationNumber(request.payload.applicationNumberSearch);

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
          applicationNumber: response.data.applicationNumber 
        };

        request.yar.set("data", resultData);
      
      } else {
        if (response.status === 404) {
          return h.redirect("/application-not-found");
        } else {
          return h.view(VIEW_PATH, {
            error: response.error,
            errorSummary: response.error,
            activeTab: "ptd",
            documentSearchMainModelData:
              await documentSearchMainService.getDocumentSearchMain(),
          });
        }
      }

      return h.redirect("/checker/search-results");
    }

       // Search by Application Number
    if (request.payload.documentSearch === "application") {
      const validationResult = validateApplicationNumber(
        request.payload.applicationNumberSearch
      );

      if (!validationResult.isValid) {
        return h.view(VIEW_PATH, {
          error: validationResult.error,
          errorSummary: `${validationResult.error}`,
          activeTab: "application",
          documentSearchMainModelData: await documentSearchMainService.getDocumentSearchMain(),
        });
      }
      
      const response = await apiService.getApplicationByApplicationNumber(request.payload.applicationNumberSearch);

      if (response.data) {
        request.yar.set("applicationNumber", microchipNumber);

        let statusName = response.data.status.toLowerCase();
        if (statusName === 'authorised') {
          statusName = 'approved';
        }
        else if (statusName === 'awaiting verification') {
          statusName = 'awaiting';
        }
        else if (statusName === 'rejected') {
          statusName = 'revoked';
        }

        const resultData = { 
          documentState: statusName,
          applicationNumber: response.data.applicationNumber 
        };

        request.yar.set("data", resultData);
      
      } else {
        if (response.status === 404) {
          return h.redirect("/application-not-found");
        } else {
          return h.view(VIEW_PATH, {
            error: response.error,
            errorSummary: `${response.error}`,
            activeTab: "application",
            documentSearchMainModelData: await documentSearchMainService.getDocumentSearchMain(),
          });
        }
      }

      return h.redirect("/checker/search-results");
    } 

    // Search by Microchip Number
    if (documentSearch === "microchip") {
      const validationResult = validateMicrochipNumber(microchipNumber);
      if (!validationResult.isValid) {
        return h.view(VIEW_PATH, {
          error: validationResult.error,
          errorSummary: validationResult.error,
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
            errorSummary: microchipAppPtdMainData.error,
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
