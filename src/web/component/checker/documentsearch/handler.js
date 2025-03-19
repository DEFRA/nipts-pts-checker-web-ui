"use strict";

import documentSearchMainService from "../../../../api/services/documentSearchMainService.js";
import apiService from "../../../../api/services/apiService.js";
import microchipApi from "../../../../api/services/microchipAppPtdMainService.js";
import {
  validatePtdNumber,
  validateApplicationNumber,
  validateMicrochipNumber,
} from "./validate.js";
import DashboardMainModel from "../../../../constants/dashBoardConstant.js";
import headerData from "../../../../web/helper/constants.js";
import DocumentSearchModel from "../../../../constants/documentSearchConstant.js";

const VIEW_PATH = "componentViews/checker/documentsearch/documentSearchView";
const NOT_FOUND_VIEW_PATH =
  "componentViews/checker/documentsearch/documentNotFoundView";

const SEARCH_RESULT_VIEW_PATH = "/checker/search-results";

const errorProcessingText = "An error occurred while processing your request";

const getDocumentSearch = async (_request, h) => {
  try {
    headerData.section = "search";
    const documentSearchMainModelData =
      await documentSearchMainService.getDocumentSearchMain();
    let successConfirmation = _request.yar.get("successConfirmation");
    if (successConfirmation === null) {
      successConfirmation = false;
    }
    _request.yar.clear("successConfirmation");
    return h.view(VIEW_PATH, {
      documentSearchMainModelData,
      successConfirmation,
      formSubmitted: false,
      // Initialize empty values for input fields
      ptdNumberSearch: "",
      applicationNumberSearch: "",
      microchipNumber: "",
    });
  } catch (error) {
    return h.view(VIEW_PATH, {
      error: "Failed to fetch document search data",
    });
  }
};

async function handlePTD(searchText, request, h) {
  const validationResult = validatePtdNumber(searchText);
      if (!validationResult.isValid) {
        return h.view(VIEW_PATH, {
          error: validationResult.error,
          errorSummary: [{
            fieldId: "ptdNumberSearch",
            message: validationResult.error,
          }],
          activeTab: "ptd",
          formSubmitted: true,
          ptdNumberSearch: searchText,
          applicationNumberSearch: "",
          microchipNumber: "",
          documentSearchMainModelData:
            await documentSearchMainService.getDocumentSearchMain(searchText),
        });
      }

      const ptdNumber = `GB826${searchText}`;
      const responseData = await apiService.getApplicationByPTDNumber(
        ptdNumber,
        request
      );

      if (!responseData.error) {
        request.yar.set("ptdNumber", ptdNumber);
        request.yar.set("data", responseData);

        return h.redirect(SEARCH_RESULT_VIEW_PATH);
      }

      if (responseData.error === "Application not found") {
        return h.view(NOT_FOUND_VIEW_PATH, {
          searchValue: ptdNumber,
          pageTitle: DashboardMainModel.dashboardMainModelData.pageTitle,
        });
      } else {
        return h.view(VIEW_PATH, {
          error: errorProcessingText,
          errorSummary: [{
            fieldId: "ptdNumberSearch",
            message: errorProcessingText,
          }],
          activeTab: "ptd",
          formSubmitted: true,
          ptdNumberSearch: searchText,
          applicationNumberSearch: "",
          microchipNumber: "",
          documentSearchMainModelData:
            await documentSearchMainService.getDocumentSearchMain(
              searchText
            ),
        });
      }
}

async function handleApplication(searchText, request, h) {
  const validationResult = validateApplicationNumber(searchText);

      if (!validationResult.isValid) {
        return h.view(VIEW_PATH, {
          error: validationResult.error,
          errorSummary: [{
            fieldId: "applicationNumberSearch",
            message: validationResult.error,
          }],
          activeTab: "application",
          formSubmitted: true,
          ptdNumberSearch: "",
          applicationNumberSearch: searchText,
          microchipNumber: "",
          documentSearchMainModelData:
            await documentSearchMainService.getDocumentSearchMain(searchText),
        });
      }

      const applicationNumber = searchText;
      const responseData = await apiService.getApplicationByApplicationNumber(
        applicationNumber,
        request
      );

      if (!responseData.error) {
        request.yar.set("applicationNumber", applicationNumber);
        request.yar.set("data", responseData);

        return h.redirect(SEARCH_RESULT_VIEW_PATH);
      }

      
      if (responseData.error === "not_found") {
        return h.view(NOT_FOUND_VIEW_PATH, {
          searchValue: applicationNumber,
          pageTitle: DashboardMainModel.dashboardMainModelData.pageTitle,
        });
      } else {
        return h.view(VIEW_PATH, {
          error: errorProcessingText,
          errorSummary: [{
            fieldId: "applicationNumberSearch",
            message: errorProcessingText,
          }],
          activeTab: "application",
          formSubmitted: true,
          ptdNumberSearch: "",
          applicationNumberSearch: searchText,
          microchipNumber: "",
          documentSearchMainModelData:
            await documentSearchMainService.getDocumentSearchMain(searchText),
        });
      }
}

async function handleMicrochip(searchText, request, h) {
  const validationResult = validateMicrochipNumber(searchText);
      if (!validationResult.isValid) {
        return h.view(VIEW_PATH, {
          error: validationResult.error,
          errorSummary: [{
            fieldId: "microchipNumber",
            message: validationResult.error,
          }],
          activeTab: "microchip",
          formSubmitted: true,
          ptdNumberSearch: "",
          applicationNumberSearch: "",
          microchipNumber: searchText,
          documentSearchMainModelData:
            await documentSearchMainService.getDocumentSearchMain(searchText),
        });
      }

      const microchipAppPtdMainData = await microchipApi.getMicrochipData(
        searchText,
        request
      );

      if (!microchipAppPtdMainData.error) {
        request.yar.set("microchipNumber", searchText);
        request.yar.set("data", microchipAppPtdMainData);

        return h.redirect(SEARCH_RESULT_VIEW_PATH);
      }

      if (microchipAppPtdMainData.error === "not_found") {
        return h.view(NOT_FOUND_VIEW_PATH, {
          searchValue: searchText,
          pageTitle: DashboardMainModel.dashboardMainModelData.pageTitle,
        });
      } else {
        return h.view(VIEW_PATH, {
          error: errorProcessingText,
          errorSummary: [{
            fieldId: "microchipNumber",
            message: errorProcessingText,
          }],
          activeTab: "microchip",
          formSubmitted: true,
          ptdNumberSearch: "",
          applicationNumberSearch: "",
          microchipNumber: searchText,
          documentSearchMainModelData:
            await documentSearchMainService.getDocumentSearchMain(searchText),
        });
      }
}

function handleEmptyDocumentSearch(h) {
  const errorMsg = "Select if you are searching for a PTD, application or microchip number"
  return h.view(VIEW_PATH, {
    error: errorMsg,
    errorSummary: [
      {
        fieldId: "documentSearch-1",
        message: errorMsg,
      },
    ],
    errorRadioUnchecked: true,
    formSubmitted: true,
    ptdNumberSearch: "",
    applicationNumberSearch: "",
    microchipNumber: "",
    documentSearchMainModelData: DocumentSearchModel.documentSearchMainModelData,
  });
}

async function handleError(request, h, error) {
  console.log(error.message)
    // Handle unexpected errors
    const ptdNumberSearch = request.payload.ptdNumberSearch || "";
    const applicationNumberSearch = request.payload.applicationNumberSearch || "";
    const microchipNumberSearch = request.payload.microchipNumber || "";
    const activeTab = request.payload.documentSearch || "ptd";

    return h.view(VIEW_PATH, {
      error: errorProcessingText,
      errorSummary: [
        { fieldId: "general", message: "An unexpected error occurred" },
      ],
      formSubmitted: true,
      activeTab,
      ptdNumberSearch,
      applicationNumberSearch,
      microchipNumber: microchipNumberSearch,
      documentSearchMainModelData:
        await documentSearchMainService.getDocumentSearchMain(''),
    });
}

const submitSearch = async (request, h) => {
  try {
    const {
      documentSearch,
      ptdNumberSearch,
      applicationNumberSearch,
      microchipNumber,
    } = request.payload;

    // Search by PTD Number
    if (documentSearch === "ptd") {
      return await handlePTD(ptdNumberSearch, request, h)
    }

    // Search by Application Number
    if (documentSearch === "application") {
      return await handleApplication(applicationNumberSearch, request, h)
    }

    // Search by Microchip Number
    if (documentSearch === "microchip") {
      return await handleMicrochip(microchipNumber, request, h) 
    }

    if (documentSearch === '' || !documentSearch) {
      return handleEmptyDocumentSearch(h)
    }

    // Default redirect if none of the above conditions are met
    return h.redirect(SEARCH_RESULT_VIEW_PATH);
  } catch (error) {
    return await handleError(request, h, error)
  }
};

export const DocumentSearchHandlers = {
  getDocumentSearch,
  submitSearch,
};
