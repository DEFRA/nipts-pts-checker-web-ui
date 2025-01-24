"use strict";

import { DocumentSearchHandlers } from "../../../../../web/component/checker/documentsearch/handler.js";
import documentSearchMainService from "../../../../../api/services/documentSearchMainService.js";
import microchipApi from "../../../../../api/services/microchipAppPtdMainService.js";
import apiService from "../../../../../api/services/apiService.js";
import {
  validatePtdNumber,
  validateMicrochipNumber,
  validateApplicationNumber,
} from "../../../../../web/component/checker/documentsearch/validate.js";

jest.mock("../../../../../api/services/documentSearchMainService.js");
jest.mock("../../../../../api/services/microchipAppPtdMainService.js");
jest.mock("../../../../../api/services/apiService.js");
jest.mock("../../../../../web/component/checker/documentsearch/validate.js");

const microchipNumberErrorMessage = "Enter a microchip number";
const microchipLengthErrorMessage = "Enter a 15-digit number";
const applicationNumberErrorMessage =  "Enter 6 characters after 'GB826'";
const searchResultsPage = "/checker/search-results";

const pageTitleDefault =
  "Pet Travel Scheme: Check a pet travelling from Great Britain to Northern Ireland";

const documentNotFoundView = "componentViews/checker/documentsearch/documentNotFoundView";
const errorOccureredText = errorOccureredText;

describe("DocumentSearchHandlers", () => {
  describe("getDocumentSearch", () => {
    let _request, h;

    beforeEach(() => {
      _request = {
        yar: {
          get: jest.fn(),
          clear: jest.fn(),
        },
      };

      h = {
        view: jest.fn(),
      };
    });

    it("should return the document search view with data on successful fetch", async () => {
      const mockData = { some: "data" };
      documentSearchMainService.getDocumentSearchMain.mockResolvedValue(
        mockData
      );
      _request.yar.get.mockReturnValueOnce(true);

      await DocumentSearchHandlers.getDocumentSearch(_request, h);

      expect(
        documentSearchMainService.getDocumentSearchMain
      ).toHaveBeenCalled();
      expect(_request.yar.get).toHaveBeenCalledWith("successConfirmation");
      expect(_request.yar.clear).toHaveBeenCalledWith("successConfirmation");
      expect(h.view).toHaveBeenCalledWith(
        "componentViews/checker/documentsearch/documentSearchView",
        {
          documentSearchMainModelData: mockData,
          successConfirmation: true,
          activeTab: "ptd",
          formSubmitted: false,
          ptdNumberSearch: "",
          applicationNumberSearch: "",
          microchipNumber: "",
        }
      );
    });

    it("should return the document search view with successConfirmation as false if it is null", async () => {
      const mockData = { some: "data" };
      documentSearchMainService.getDocumentSearchMain.mockResolvedValue(
        mockData
      );
      _request.yar.get.mockReturnValueOnce(null);

      await DocumentSearchHandlers.getDocumentSearch(_request, h);

      expect(
        documentSearchMainService.getDocumentSearchMain
      ).toHaveBeenCalled();
      expect(_request.yar.get).toHaveBeenCalledWith("successConfirmation");
      expect(_request.yar.clear).toHaveBeenCalledWith("successConfirmation");
      expect(h.view).toHaveBeenCalledWith(
        "componentViews/checker/documentsearch/documentSearchView",
        {
          documentSearchMainModelData: mockData,
          successConfirmation: false,
          activeTab: "ptd",
          formSubmitted: false,
          ptdNumberSearch: "",
          applicationNumberSearch: "",
          microchipNumber: "",
        }
      );
    });

    it("should return the error view if fetching data fails", async () => {
      documentSearchMainService.getDocumentSearchMain.mockRejectedValue(
        new Error("Fetch error")
      );

      await DocumentSearchHandlers.getDocumentSearch(_request, h);

      expect(
        documentSearchMainService.getDocumentSearchMain
      ).toHaveBeenCalled();
      expect(h.view).toHaveBeenCalledWith(
        "componentViews/checker/documentsearch/documentSearchView",
        { error: "Failed to fetch document search data" }
      );
    });
  });

  describe("submitSearch", () => {
    const mockData = {
      pageHeading: "Find a document",
      pageTitle: pageTitleDefault,
      ptdSearchText: "GB826",
      errorLabel: "Error:",
      searchOptions: [
        { value: "Search by PTD number", error: "Enter a PTD number" },
        {
          value: "Search by application number",
          error: "Enter an application number",
        },
        {
          value: "Search by microchip number",
          error: "Enter a PTD or application number",
        },
      ],
    };

    it("should handle microchip search with missing microchip number", async () => {
      const request = {
        payload: { documentSearch: "microchip", microchipNumber: "" },
      };
      const h = {
        view: jest.fn().mockReturnValue({}),
      };

      documentSearchMainService.getDocumentSearchMain.mockResolvedValue(
        mockData
      );

      validateMicrochipNumber.mockReturnValue({
        isValid: false,
        error: microchipNumberErrorMessage,
      });

      await DocumentSearchHandlers.submitSearch(request, h);

      expect(h.view).toHaveBeenCalledWith(
        "componentViews/checker/documentsearch/documentSearchView",
        {
          error: microchipNumberErrorMessage,
          errorSummary: [
            { fieldId: "microchipNumber", message: microchipNumberErrorMessage },
          ],
          activeTab: "microchip",
          formSubmitted: true,
          ptdNumberSearch: "",
          applicationNumberSearch: "",
          microchipNumber: "",
          documentSearchMainModelData: mockData,
        }
      );
    });

    it("should handle microchip search with invalid microchip number", async () => {
      const request = {
        payload: { documentSearch: "microchip", microchipNumber: "123" },
      };
      const h = {
        view: jest.fn().mockReturnValue({}),
      };

      documentSearchMainService.getDocumentSearchMain.mockResolvedValue(
        mockData
      );

      validateMicrochipNumber.mockReturnValue({
        isValid: false,
        error: microchipLengthErrorMessage,
      });

      await DocumentSearchHandlers.submitSearch(request, h);

      expect(h.view).toHaveBeenCalledWith(
        "componentViews/checker/documentsearch/documentSearchView",
        {
          error: microchipLengthErrorMessage,
          errorSummary: [
            { fieldId: "microchipNumber", message: microchipLengthErrorMessage },
          ],
          activeTab: "microchip",
          formSubmitted: true,
          ptdNumberSearch: "",
          applicationNumberSearch: "",
          microchipNumber: "123",
          documentSearchMainModelData: mockData,
        }
      );
    });

    it("should handle microchip search with microchip data not found", async () => {
      const request = {
        payload: {
          documentSearch: "microchip",
          microchipNumber: "123456789012345",
        },
      };
      const h = {
        redirect: jest.fn().mockReturnValue({}),
        view: jest.fn().mockReturnValue({}),
      };

      validateMicrochipNumber.mockReturnValue({ isValid: true, error: null });

      microchipApi.getMicrochipData.mockResolvedValue({ error: "not_found" });
      documentSearchMainService.getDocumentSearchMain.mockResolvedValue(
        mockData
      );

      await DocumentSearchHandlers.submitSearch(request, h);
      expect(h.view).toHaveBeenCalledWith(
        documentNotFoundView,
        {
          pageTitle: pageTitleDefault,
          searchValue: request.payload.microchipNumber,
        }
      );
    });

    it("should handle PTD search with valid number", async () => {
      const request = {
        payload: {
          documentSearch: "ptd",
          ptdNumberSearch: "123456",
        },
        yar: {
          set: jest.fn(),
        },
      };
      const h = {
        redirect: jest.fn().mockReturnValue({}),
        view: jest.fn().mockReturnValue({}),
      };

      validatePtdNumber.mockReturnValue({ isValid: true, error: null });
      apiService.getApplicationByPTDNumber.mockResolvedValue({
        data: { status: "authorised", ptdNumber: "GB826123456" },
      });
      documentSearchMainService.getDocumentSearchMain.mockResolvedValue(
        mockData
      );

      await DocumentSearchHandlers.submitSearch(request, h);

      expect(apiService.getApplicationByPTDNumber).toHaveBeenCalledWith(
        "GB826123456",
        request
      );
      expect(request.yar.set).toHaveBeenNthCalledWith(
        1,
        "ptdNumber",
        "GB826123456"
      );
      expect(request.yar.set).toHaveBeenNthCalledWith(2, "data", {
        data: { status: "authorised", ptdNumber: "GB826123456" },
      });
      expect(h.redirect).toHaveBeenCalledWith(searchResultsPage);
    });

    it("should handle PTD search with invalid number", async () => {
      const request = {
        payload: {
          documentSearch: "ptd",
          ptdNumberSearch: "123",
        },
      };
      const h = {
        view: jest.fn().mockReturnValue({}),
      };

      documentSearchMainService.getDocumentSearchMain.mockResolvedValue(
        mockData
      );

      validatePtdNumber.mockReturnValue({
        isValid: false,
        error: applicationNumberErrorMessage,
      });

      await DocumentSearchHandlers.submitSearch(request, h);

      expect(h.view).toHaveBeenCalledWith(
        "componentViews/checker/documentsearch/documentSearchView",
        {
          error: applicationNumberErrorMessage,
          errorSummary: [
            {
              fieldId: "ptdNumberSearch",
              message: applicationNumberErrorMessage,
            },
          ],
          activeTab: "ptd",
          formSubmitted: true,
          ptdNumberSearch: "123",
          applicationNumberSearch: "",
          microchipNumber: "",
          documentSearchMainModelData: mockData,
        }
      );
    });

    it("should handle PTD search with PTD data not found", async () => {
      const request = {
        payload: {
          documentSearch: "ptd",
          ptdNumberSearch: "123456",
        },
      };
      const h = {
        redirect: jest.fn().mockReturnValue({}),
        view: jest.fn().mockReturnValue({}),
      };

      validatePtdNumber.mockReturnValue({ isValid: true, error: null });
      apiService.getApplicationByPTDNumber.mockResolvedValue({
        error: "not_found",
      });
      documentSearchMainService.getDocumentSearchMain.mockResolvedValue(
        mockData
      );

      await DocumentSearchHandlers.submitSearch(request, h);

      expect(h.view).toHaveBeenCalledWith(
        documentNotFoundView,
        {
          pageTitle: pageTitleDefault,
          searchValue: "GB826" + request.payload.ptdNumberSearch,
        }
      );
    });

    it("should handle application search with valid number", async () => {
      const request = {
        payload: {
          documentSearch: "application",
          applicationNumberSearch: "ELK7I8N4",
        },
        yar: {
          set: jest.fn(),
        },
      };
      const h = {
        redirect: jest.fn().mockReturnValue({}),
        view: jest.fn().mockReturnValue({}),
      };

      validateApplicationNumber.mockReturnValue({ isValid: true, error: null });
      apiService.getApplicationByApplicationNumber.mockResolvedValue({
        data: {
          status: "authorised",
          applicationNumber: "ELK7I8N4",
          documentState: "approved",
        },
      });
      documentSearchMainService.getDocumentSearchMain.mockResolvedValue(
        mockData
      );

      await DocumentSearchHandlers.submitSearch(request, h);

      expect(apiService.getApplicationByApplicationNumber).toHaveBeenCalledWith(
        "ELK7I8N4",
        request
      );

      expect(request.yar.set).toHaveBeenNthCalledWith(
        1,
        "applicationNumber",
        "ELK7I8N4"
      );
      expect(request.yar.set).toHaveBeenNthCalledWith(2, "data", {
        data: {
          applicationNumber: "ELK7I8N4",
          documentState: "approved",
          status: "authorised",
        },
      });

      expect(h.redirect).toHaveBeenCalledWith(searchResultsPage);
    });

    it("should handle application search with application data not found", async () => {
      const request = {
        payload: {
          documentSearch: "application",
          applicationNumberSearch: "ELK7I8N4",
        },
      };
      const h = {
        redirect: jest.fn().mockReturnValue({}),
        view: jest.fn().mockReturnValue({}),
      };

      validateApplicationNumber.mockReturnValue({ isValid: true, error: null });
      apiService.getApplicationByApplicationNumber.mockResolvedValue({
        error: "not_found",
      });
      documentSearchMainService.getDocumentSearchMain.mockResolvedValue(
        mockData
      );

      await DocumentSearchHandlers.submitSearch(request, h);

      expect(h.view).toHaveBeenCalledWith(
        documentNotFoundView,
        {
          pageTitle: pageTitleDefault,
          searchValue: request.payload.applicationNumberSearch,
        }
      );
    });

    it("should handle unexpected error during search", async () => {
      const request = {
        payload: {
          documentSearch: "ptd",
          ptdNumberSearch: "123456",
        },
      };
      const h = {
        view: jest.fn().mockReturnValue({}),
      };

      validatePtdNumber.mockReturnValue({ isValid: true, error: null });
      apiService.getApplicationByPTDNumber.mockRejectedValue(
        new Error("Service failure")
      );
      documentSearchMainService.getDocumentSearchMain.mockResolvedValue(
        mockData
      );

      await DocumentSearchHandlers.submitSearch(request, h);

      expect(h.view).toHaveBeenCalledWith(
        "componentViews/checker/documentsearch/documentSearchView",
        {
          error: errorOccureredText,
          errorSummary: [
            { fieldId: "general", message: "An unexpected error occurred" },
          ],
          formSubmitted: true,
          activeTab: "ptd",
          ptdNumberSearch: "123456",
          applicationNumberSearch: "",
          microchipNumber: "",
          documentSearchMainModelData: mockData,
        }
      );
    });

    it("should handle microchip search with 'not_found' error", async () => {
      const request = {
        payload: { documentSearch: "microchip", microchipNumber: "123456" },
      };
      const h = {
        view: jest.fn().mockReturnValue({}),
      };
    
      const NOT_FOUND_VIEW_PATH = 'componentViews/checker/documentsearch/documentNotFoundView';
      const mockPageTitle = pageTitleDefault;
    
      documentSearchMainService.getDocumentSearchMain.mockResolvedValue('mockData');
      microchipApi.getMicrochipData.mockResolvedValue({ error: "not_found" });
    
      await DocumentSearchHandlers.submitSearch(request, h);
    
      expect(h.view).toHaveBeenCalledWith(
        NOT_FOUND_VIEW_PATH,
        {
          searchValue: "123456",
          pageTitle: mockPageTitle,
        }
      );
    });
    
    
    it("should handle microchip search with an error other than 'not_found'", async () => {
      const request = {
        payload: { documentSearch: "microchip", microchipNumber: "123456" },
      };
      const h = {
        view: jest.fn().mockReturnValue({}),
      };
    
      const NOT_FOUND_VIEW_PATH = 'componentViews/checker/documentsearch/documentNotFoundView';
      const mockPageTitle = pageTitleDefault;
    
      documentSearchMainService.getDocumentSearchMain.mockResolvedValue('mockData');
      microchipApi.getMicrochipData.mockResolvedValue({ error: "not_found" });
    
      await DocumentSearchHandlers.submitSearch(request, h);
    
      expect(h.view).toHaveBeenCalledWith(
        NOT_FOUND_VIEW_PATH,
        {
          searchValue: "123456",
          pageTitle: mockPageTitle,
        }
      );
    });

    it("should handle microchip search with error and return VIEW_PATH", async () => {
      const request = {
        payload: { documentSearch: "microchip", microchipNumber: "123456" },
      };
      const h = {
        view: jest.fn().mockReturnValue({}),
      };
    
      const errorProcessingText = errorOccureredText;
      const mockData = "mockData";  
      const VIEW_PATH = 'componentViews/checker/documentsearch/documentSearchView';
    
      documentSearchMainService.getDocumentSearchMain.mockResolvedValue(mockData);
      microchipApi.getMicrochipData.mockResolvedValue({ error: "some_error" });
    
      await DocumentSearchHandlers.submitSearch(request, h);
    
      expect(h.view).toHaveBeenCalledWith(
        VIEW_PATH,
        {
          error: errorProcessingText,
          errorSummary: [
            { fieldId: "microchipNumber", message: errorProcessingText },
          ],
          activeTab: "microchip",
          formSubmitted: true,
          ptdNumberSearch: "",
          applicationNumberSearch: "",
          microchipNumber: "123456",
          documentSearchMainModelData: mockData,
        }
      );
    });

    it("should handle application search with error and return VIEW_PATH", async () => {
      const request = {
        payload: { documentSearch: "application", applicationNumberSearch: "987654" },
      };
      const h = {
        view: jest.fn().mockReturnValue({}),
      };
    
      const errorProcessingText = errorOccureredText;
      const mockData = "mockData";  // Replace with actual mock data
      const VIEW_PATH = 'componentViews/checker/documentsearch/documentSearchView';  // Replace with actual value
    
      documentSearchMainService.getDocumentSearchMain.mockResolvedValue(mockData);
      apiService.getApplicationByApplicationNumber.mockResolvedValue({ error: "some_error" });
    
      await DocumentSearchHandlers.submitSearch(request, h);
    
      expect(h.view).toHaveBeenCalledWith(
        VIEW_PATH,
        {
          error: errorProcessingText,
          errorSummary: [
            { fieldId: "applicationNumberSearch", message: errorProcessingText },
          ],
          activeTab: "application",
          formSubmitted: true,
          ptdNumberSearch: "",
          applicationNumberSearch: "987654",
          microchipNumber: "",
          documentSearchMainModelData: mockData,
        }
      );
    });

    it("should handle PTD search with error and return VIEW_PATH", async () => {
      const request = {
        payload: { documentSearch: "ptd", ptdNumberSearch: "GB826123456" },
      };
      const h = {
        view: jest.fn().mockReturnValue({}),
      };
    
      const errorProcessingText = "An error occurred while processing your request";
      const mockData = "mockData";
      const VIEW_PATH = 'componentViews/checker/documentsearch/documentSearchView'; 
    
      documentSearchMainService.getDocumentSearchMain.mockResolvedValue(mockData);
      apiService.getApplicationByPTDNumber.mockResolvedValue({ error: "some_error" });
    
      await DocumentSearchHandlers.submitSearch(request, h);
    
      expect(h.view).toHaveBeenCalledWith(
        VIEW_PATH,
        {
          error: errorProcessingText,
          errorSummary: [
            { fieldId: "ptdNumberSearch", message: errorProcessingText },
          ],
          activeTab: "ptd",
          formSubmitted: true,
          ptdNumberSearch: "GB826123456",
          applicationNumberSearch: "",
          microchipNumber: "",
          documentSearchMainModelData: mockData,
        }
      );
    });

    it("should handle invalid application number and return VIEW_PATH", async () => {
      const request = {
        payload: { documentSearch: "application", applicationNumberSearch: "invalidNumber" },
      };
      const h = {
        view: jest.fn().mockReturnValue({}),
      };
    
      const validationResult = { isValid: false, error: "Invalid application number" };
      const mockData = "mockData";
      const VIEW_PATH = 'componentViews/checker/documentsearch/documentSearchView';
    
      documentSearchMainService.getDocumentSearchMain.mockResolvedValue(mockData);
      validateApplicationNumber.mockReturnValue(validationResult);
    
      await DocumentSearchHandlers.submitSearch(request, h);
    
      expect(h.view).toHaveBeenCalledWith(
        VIEW_PATH,
        {
          error: validationResult.error,
          errorSummary: [
            { fieldId: "applicationNumberSearch", message: validationResult.error },
          ],
          activeTab: "application",
          formSubmitted: true,
          ptdNumberSearch: "",
          applicationNumberSearch: "invalidNumber",
          microchipNumber: "",
          documentSearchMainModelData: mockData,
        }
      );
    }); 

    it("should set microchipNumber and data in yar and redirect to SEARCH_RESULT_VIEW_PATH", async () => {
      const request = {
        payload: { documentSearch: "microchip", microchipNumber: "123456" },
        yar: { set: jest.fn() },
      };
      const h = {
        redirect: jest.fn().mockReturnValue({}),
      };
    
      const mockData = "mockData";
    
      microchipApi.getMicrochipData.mockResolvedValue(mockData);
    
      await DocumentSearchHandlers.submitSearch(request, h);
    
      expect(request.yar.set).toHaveBeenCalledWith("microchipNumber", "123456");
      expect(request.yar.set).toHaveBeenCalledWith("data", mockData);
      expect(h.redirect).toHaveBeenCalledWith(searchResultsPage);
    });

    it("should perform default redirect to SEARCH_RESULT_VIEW_PATH if no conditions are met", async () => {
      const request = {
        payload: { documentSearch: "none", microchipNumber: "", ptdNumberSearch: "", applicationNumberSearch: "" },
      };
      const h = {
        redirect: jest.fn().mockReturnValue({}),
      };
    
      await DocumentSearchHandlers.submitSearch(request, h);
    
      expect(h.redirect).toHaveBeenCalledWith(searchResultsPage);
    });
    
  });
});
