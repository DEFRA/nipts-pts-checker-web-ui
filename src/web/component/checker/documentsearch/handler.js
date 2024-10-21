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
      activeTab: "ptd", // Default active tab
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

const submitSearch = async (request, h) => {
  let searchText = "";
  try {
    const {
      documentSearch,
      ptdNumberSearch,
      applicationNumberSearch,
      microchipNumber,
    } = request.payload;

    // Initialize variables to pass to the template
    let activeTab = documentSearch;
    let error = null;
    let errorSummary = [];

    // Search by PTD Number
    if (documentSearch === "ptd") {
      searchText = ptdNumberSearch || "";
      const validationResult = validatePtdNumber(searchText);
      if (!validationResult.isValid) {
        error = validationResult.error;
        errorSummary.push({
          fieldId: "ptdNumberSearch",
          message: validationResult.error,
        });
        return h.view(VIEW_PATH, {
          error,
          errorSummary,
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

      if (responseData.error) {
        if (responseData.error === "not_found") {
          return h.view(NOT_FOUND_VIEW_PATH, {
            searchValue: ptdNumber,
            pageTitle: DashboardMainModel.dashboardMainModelData.pageTitle,
          });
        } else {
          error = errorProcessingText;
          errorSummary.push({
            fieldId: "ptdNumberSearch",
            message: errorProcessingText,
          });
          return h.view(VIEW_PATH, {
            error,
            errorSummary,
            activeTab: "ptd",
            formSubmitted: true,
            ptdNumberSearch: searchText,
            applicationNumberSearch: "",
            microchipNumber: "",
            documentSearchMainModelData:
              await documentSearchMainService.getDocumentSearchMain(searchText),
          });
        }
      }

      request.yar.set("ptdNumber", ptdNumber);
      request.yar.set("data", responseData);

      return h.redirect(SEARCH_RESULT_VIEW_PATH);
    }

    // Search by Application Number
    if (documentSearch === "application") {
      searchText = applicationNumberSearch || "";

      const validationResult = validateApplicationNumber(searchText);

      if (!validationResult.isValid) {
        error = validationResult.error;
        errorSummary.push({
          fieldId: "applicationNumberSearch",
          message: validationResult.error,
        });
        return h.view(VIEW_PATH, {
          error,
          errorSummary,
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

      if (responseData.error) {
        if (responseData.error === "not_found") {
          return h.view(NOT_FOUND_VIEW_PATH, {
            searchValue: applicationNumber,
            pageTitle: DashboardMainModel.dashboardMainModelData.pageTitle,
          });
        } else {
          error = errorProcessingText;
          errorSummary.push({
            fieldId: "applicationNumberSearch",
            message: errorProcessingText,
          });
          return h.view(VIEW_PATH, {
            error,
            errorSummary,
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
      request.yar.set("applicationNumber", applicationNumber);
      request.yar.set("data", responseData);

      return h.redirect(SEARCH_RESULT_VIEW_PATH);
    }

    // Search by Microchip Number
    if (documentSearch === "microchip") {
      searchText = microchipNumber || "";

      const validationResult = validateMicrochipNumber(searchText);
      if (!validationResult.isValid) {
        error = validationResult.error;
        errorSummary.push({
          fieldId: "microchipNumber",
          message: validationResult.error,
        });
        return h.view(VIEW_PATH, {
          error,
          errorSummary,
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

      if (microchipAppPtdMainData.error) {
        if (microchipAppPtdMainData.error === "not_found") {
          return h.view(NOT_FOUND_VIEW_PATH, {
            searchValue: microchipNumber,
            pageTitle: DashboardMainModel.dashboardMainModelData.pageTitle,
          });
        } else {
          error = errorProcessingText;
          errorSummary.push({
            fieldId: "microchipNumber",
            message: errorProcessingText,
          });
          return h.view(VIEW_PATH, {
            error,
            errorSummary,
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

      request.yar.set("microchipNumber", microchipNumber);
      request.yar.set("data", microchipAppPtdMainData);

      return h.redirect(SEARCH_RESULT_VIEW_PATH);
    }

    // Default redirect if none of the above conditions are met
    return h.redirect(SEARCH_RESULT_VIEW_PATH);
  } catch (error) {
    // Handle unexpected errors
    let ptdNumberSearch = request.payload.ptdNumberSearch || "";
    let applicationNumberSearch = request.payload.applicationNumberSearch || "";
    let microchipNumberSearch = request.payload.microchipNumber || "";
    let activeTab = request.payload.documentSearch || "ptd";

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
        await documentSearchMainService.getDocumentSearchMain(searchText),
    });
  }
};

export const DocumentSearchHandlers = {
  getDocumentSearch,
  submitSearch,
};
