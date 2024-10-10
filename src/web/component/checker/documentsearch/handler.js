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
      if(successConfirmation === null)
      {
        successConfirmation = false;
      }
      _request.yar.clear("successConfirmation");
    return h.view(VIEW_PATH, { documentSearchMainModelData, successConfirmation });
  } catch (error) {
    return h.view(VIEW_PATH, {
      error: "Failed to fetch document search data",
    });
  }
};

const submitSearch = async (request, h) => {
  let searchText = "";
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
          return h.view(VIEW_PATH, {
            error: responseData.error,
            errorSummary: [
              {
                fieldId: "microchipNumber",
                message: responseData.error,
              },
            ],
            activeTab: "ptd",
            formSubmitted: true,
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

      const applicationNumber = request.payload.applicationNumberSearch;
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
          return h.view(VIEW_PATH, {
            error: errorProcessingText,
            errorSummary: [
              {
                fieldId: "general",
                message: errorProcessingText
              },
            ],
            activeTab: "application",
            formSubmitted: true,
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
        microchipNumber,
        request
      );

      if (microchipAppPtdMainData.error) {
        if (microchipAppPtdMainData.error === "not_found") {
          return h.view(NOT_FOUND_VIEW_PATH, {
            searchValue: microchipNumber,
            pageTitle: DashboardMainModel.dashboardMainModelData.pageTitle,
          });
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

      return h.redirect(SEARCH_RESULT_VIEW_PATH);
    }

    return h.redirect(SEARCH_RESULT_VIEW_PATH);
  } catch (error) {
    return h.view(VIEW_PATH, {
      error: errorProcessingText,
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
