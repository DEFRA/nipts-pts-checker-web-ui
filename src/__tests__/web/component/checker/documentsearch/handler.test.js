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

describe("DocumentSearchHandlers", () => {
  describe("getDocumentSearch", () => {
    it("should return view with documentSearchMainModelData", async () => {
      const mockData = {
        pageHeading: "Find a document",
        pageTitle:
          "Pet Travel Scheme: Check a pet from Great Britain to Northern Ireland",
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

      documentSearchMainService.getDocumentSearchMain.mockResolvedValue(
        mockData
      );

      const request = {};
      const h = {
        view: jest.fn((viewPath, data) => {
          return { viewPath, data };
        }),
      };

      const response =
        await DocumentSearchHandlers.getDocumentSearch.index.handler(
          request,
          h
        );

      expect(response.viewPath).toBe(
        "componentViews/checker/documentsearch/documentSearchView"
      );
      expect(response.data).toEqual({ documentSearchMainModelData: mockData });
      expect(h.view).toHaveBeenCalledWith(
        "componentViews/checker/documentsearch/documentSearchView",
        {
          documentSearchMainModelData: mockData,
        }
      );
    });

    it("should return view with error message on failure", async () => {
      documentSearchMainService.getDocumentSearchMain.mockRejectedValue(
        new Error("Service failure")
      );

      const request = {};
      const h = {
        view: jest.fn((viewPath, data) => {
          return { viewPath, data };
        }),
      };

      const response =
        await DocumentSearchHandlers.getDocumentSearch.index.handler(
          request,
          h
        );

      expect(response.viewPath).toBe(
        "componentViews/checker/documentsearch/documentSearchView"
      );
      expect(response.data).toEqual({
        error: "Failed to fetch document search data",
      });
      expect(h.view).toHaveBeenCalledWith(
        "componentViews/checker/documentsearch/documentSearchView",
        {
          error: "Failed to fetch document search data",
        }
      );
    });
  });

  describe("submitSearch", () => {
    const mockData = {
      pageHeading: "Find a document",
      pageTitle:
        "Pet Travel Scheme: Check a pet from Great Britain to Northern Ireland",
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
        payload: { documentSearch: "microchip" },
      };
      const h = {
        view: jest.fn().mockReturnValue({}),
      };

      documentSearchMainService.getDocumentSearchMain.mockResolvedValue(
        mockData
      );

      validateMicrochipNumber.mockReturnValue({
        isValid: false,
        error: "Enter a microchip number",
      });

      const response = await DocumentSearchHandlers.submitSearch(request, h);

      expect(h.view).toHaveBeenCalledWith(
        "componentViews/checker/documentsearch/documentSearchView",
        {
          error: "Enter a microchip number",
          errorSummary: [
            { fieldId: "microchipNumber", message: "Enter a microchip number" },
          ],
          activeTab: "microchip",
          formSubmitted: true,
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
        error: "Enter a 15-digit number",
      });

      const response = await DocumentSearchHandlers.submitSearch(request, h);

      expect(h.view).toHaveBeenCalledWith(
        "componentViews/checker/documentsearch/documentSearchView",
        {
          error: "Enter a 15-digit number",
          errorSummary: [
            { fieldId: "microchipNumber", message: "Enter a 15-digit number" },
          ],
          activeTab: "microchip",
          formSubmitted: true,
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

      const response = await DocumentSearchHandlers.submitSearch(request, h);
      expect(h.view).toHaveBeenCalledWith(
        "componentViews/checker/documentsearch/documentNotFoundView",
        {
          searchValue: request.payload.microchipNumber
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

      const response = await DocumentSearchHandlers.submitSearch(request, h);

      expect(apiService.getApplicationByPTDNumber).toHaveBeenCalledWith(
        "GB826123456"
      );
      expect(request.yar.set).toHaveBeenNthCalledWith(1, "ptdNumber", "GB826123456");
      expect(request.yar.set).toHaveBeenNthCalledWith(2, "data", { "data": { status: "authorised", ptdNumber: "GB826123456"}});
      expect(h.redirect).toHaveBeenCalledWith("/checker/search-results");
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

      validatePtdNumber.mockReturnValue({
        isValid: false,
        error: "Enter 6 characters after 'GB826'",
      });
      documentSearchMainService.getDocumentSearchMain.mockResolvedValue(
        mockData
      );

      const response = await DocumentSearchHandlers.submitSearch(request, h);

      expect(h.view).toHaveBeenCalledWith(
        "componentViews/checker/documentsearch/documentSearchView",
        {
          error: "Enter 6 characters after 'GB826'",
          errorSummary: [
            {
              fieldId: "ptdNumberSearch",
              message: "Enter 6 characters after 'GB826'",
            },
          ],
          activeTab: "ptd",
          formSubmitted: true,
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
      apiService.getApplicationByPTDNumber.mockResolvedValue({ error: "not_found" });
      documentSearchMainService.getDocumentSearchMain.mockResolvedValue(
        mockData
      );

      const response = await DocumentSearchHandlers.submitSearch(request, h);

      expect(h.view).toHaveBeenCalledWith(
        "componentViews/checker/documentsearch/documentNotFoundView",
        {
          searchValue: "GB826" + request.payload.ptdNumberSearch
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
        data: { status: "authorised", applicationNumber: "ELK7I8N4", documentState: "approved" },
      });
      documentSearchMainService.getDocumentSearchMain.mockResolvedValue(
        mockData
      );

      const response = await DocumentSearchHandlers.submitSearch(request, h);

      expect(apiService.getApplicationByApplicationNumber).toHaveBeenCalledWith(
        "ELK7I8N4"
      );

      expect(request.yar.set).toHaveBeenNthCalledWith(1, "applicationNumber", "ELK7I8N4");
      expect(request.yar.set).toHaveBeenNthCalledWith(2, "data", { "data": {  applicationNumber: "ELK7I8N4", documentState: "approved",  status: "authorised",}});

      expect(h.redirect).toHaveBeenCalledWith("/checker/search-results");
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
      apiService.getApplicationByApplicationNumber.mockResolvedValue({ error: "not_found" });
      documentSearchMainService.getDocumentSearchMain.mockResolvedValue(
        mockData
      );

      const response = await DocumentSearchHandlers.submitSearch(request, h);

      expect(h.view).toHaveBeenCalledWith(
        "componentViews/checker/documentsearch/documentNotFoundView",
        {
          searchValue: request.payload.applicationNumberSearch
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

      const response = await DocumentSearchHandlers.submitSearch(request, h);

      expect(h.view).toHaveBeenCalledWith(
        "componentViews/checker/documentsearch/documentSearchView",
        {
          error: "An error occurred while processing your request",
          errorSummary: [
            { fieldId: "general", message: "An unexpected error occurred" },
          ],
          formSubmitted: true,
          documentSearchMainModelData: mockData,
        }
      );
    });
  });
});
