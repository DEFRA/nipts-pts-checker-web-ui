"use strict";

import { DocumentSearchHandlers } from "../../../../../web/component/checker/documentsearch/handler.js";
import documentSearchMainService from "../../../../../api/services/documentSearchMainService.js";
import microchipApi from "../../../../../api/services/microchipAppPtdMainService.js";

jest.mock("../../../../../api/services/documentSearchMainService.js");
jest.mock("../../../../../api/services/microchipAppPtdMainService.js");

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

    it("should handle microchip search with valid 15-digit number", async () => {
      const request = {
        payload: {
          documentSearch: "microchip",
          microchipNumber: "123456789012345",
        },
        yar: {
          set: jest.fn(),
        },
      };
      const h = {
        redirect: jest.fn().mockReturnValue({}),
        view: jest.fn().mockReturnValue({}),
      };

      microchipApi.getMicrochipData.mockResolvedValue({ data: "some data" });
      documentSearchMainService.getDocumentSearchMain.mockResolvedValue(
        mockData
      );

      const response = await DocumentSearchHandlers.submitSearch(request, h);

      expect(microchipApi.getMicrochipData).toHaveBeenCalledWith(
        "123456789012345"
      );
      expect(request.yar.set).toHaveBeenCalledWith(
        "microchipNumber",
        "123456789012345"
      );
      expect(request.yar.set).toHaveBeenCalledWith("data", {
        data: "some data",
      });
      expect(h.redirect).toHaveBeenCalledWith("/checker/search-results");
    });

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

      const response = await DocumentSearchHandlers.submitSearch(request, h);

      expect(h.view).toHaveBeenCalledWith(
        "componentViews/checker/documentsearch/documentSearchView",
        {
          error: "Enter a microchip number",
          errorSummary: "Enter a microchip number",
          activeTab: "microchip",
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

      const response = await DocumentSearchHandlers.submitSearch(request, h);

      expect(h.view).toHaveBeenCalledWith(
        "componentViews/checker/documentsearch/documentSearchView",
        {
          error: "Enter a 15-digit number",
          errorSummary: "Enter a 15-digit number",
          activeTab: "microchip",
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

      microchipApi.getMicrochipData.mockResolvedValue({ error: "not_found" });
      documentSearchMainService.getDocumentSearchMain.mockResolvedValue(
        mockData
      );

      const response = await DocumentSearchHandlers.submitSearch(request, h);

      expect(h.redirect).toHaveBeenCalledWith("/application-not-found");
    });

    it("should handle unexpected error during search", async () => {
      const request = {
        payload: {
          documentSearch: "microchip",
          microchipNumber: "123456789012345",
        },
      };
      const h = {
        view: jest.fn().mockReturnValue({}),
      };

      microchipApi.getMicrochipData.mockRejectedValue(
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
          errorSummary: "An unexpected error occurred",
          documentSearchMainModelData: mockData,
        }
      );
    });
  });
});
