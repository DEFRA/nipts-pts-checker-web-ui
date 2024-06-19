"use strict";

import documentSearchMainService from "../../../../api/services/documentSearchMainService.js";
import apiService from "../../../../api/services/apiService.js";
import microchipApi from "../../../../api/services/microchipAppPtdMainService.js";

const VIEW_PATH = "componentViews/checker/documentsearch/documentSearchView";

function isPtdNumber(str) {
  // A-F, 0-9
  return /^[a-fA-F0-9]+$/.test(str);
}

function isApplicationNumber(str) {
  // A-Z, 0-9
  return /^[a-zA-Z0-9]+$/.test(str);
}

const validatePtdNumber = (ptdNumber) => {
  var result = {
    isValid: true,
    error: null,
  };

  // Mandatory
  if (!ptdNumber || ptdNumber.length === 0) {
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

const validateApplicationNumber = (applicationNumber) => {

  var result = {
    isValid: true,
    error: null,
  };

  // Mandatory
  if (!applicationNumber || applicationNumber.length === 0) {
    result.isValid = false;
    result.error = "Enter an application number";
    return result;
  }

  // More or less than 20 characters
  if (applicationNumber.length >= 20) {
    result.isValid = false;
    result.error = "Enter a valid application number, which are 20 characters or less in length";
    return result;
  }

  if (!isApplicationNumber(applicationNumber)) {
    result.isValid = false;
    result.error =
      "Enter an application number, using only letters and numbers";
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
          errorSummary: `${validationResult.error}`,
          activeTab: "ptd",
          documentSearchMainModelData: await documentSearchMainService.getDocumentSearchMain(),
        });
      }

      const ptdNumber = `GB826${request.payload.ptdNumberSearch}`;
      const response = await apiService.getApplicationByPTDNumber(ptdNumber);

      if (response.data) {
        request.yar.set("ptdNumber", microchipNumber);

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
          ptdNumber: response.data.ptdNumber 
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
            documentSearchMainModelData: await documentSearchMainService.getDocumentSearchMain(),
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
      if (!microchipNumber) {
        return h.view(VIEW_PATH, {
          error: "Enter a microchip number",
          errorSummary: "Enter a microchip number",
          activeTab: "microchip",
          documentSearchMainModelData: await documentSearchMainService.getDocumentSearchMain(),
        });
      }
      if (!/^\d{15}$/.test(microchipNumber)) {
        return h.view(VIEW_PATH, {
          error: "Enter a 15-digit number",
          errorSummary: "Enter a 15-digit number",
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
            errorSummary: `${microchipAppPtdMainData.error}`,
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
