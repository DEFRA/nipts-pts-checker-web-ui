"use strict";

import { SearchResultsHandlers } from "../../../../../web/component/checker/searchresults/handler.js";

describe("SearchResultsHandlers", () => {
  describe("getSearchResultsHandler", () => {
    it("should return view with microchipNumber and data from session", async () => {
      const mockMicrochipNumber = "123456789012345";
      const mockData = { some: "data" };

      const request = {
        yar: {
          get: jest.fn((key) => {
            if (key === "microchipNumber") return mockMicrochipNumber;
            if (key === "data") return mockData;
          }),
        },
      };

      const h = {
        view: jest.fn((viewPath, data) => {
          return { viewPath, data };
        }),
      };

      const response =
        await SearchResultsHandlers.getSearchResultsHandler.index.handler(
          request,
          h
        );

      expect(request.yar.get).toHaveBeenCalledWith("microchipNumber");
      expect(request.yar.get).toHaveBeenCalledWith("data");
      expect(h.view).toHaveBeenCalledWith(
        "componentViews/checker/searchresults/searchResultsView",
        {
          microchipNumber: mockMicrochipNumber,
          pageTitle: "Pet Travel Scheme: Check a pet from Great Britain to Northern Ireland",
          response: mockData,
        }
      );
      expect(response.viewPath).toBe(
        "componentViews/checker/searchresults/searchResultsView"
      );

      expect(response.data).toEqual({
           "microchipNumber": "123456789012345",
            "pageTitle": "Pet Travel Scheme: Check a pet from Great Britain to Northern Ireland",
            "response": {
                "some": "data",
              }
        });
    });
  });

  describe("saveAndContinueHandler", () => {
    it("should redirect to document search if checklist is 'pass'", async () => {
      const request = {
        payload: { checklist: "pass" },
      };

      const h = {
        redirect: jest.fn((url) => {
          return { redirectedTo: url };
        }),
      };

      const response = await SearchResultsHandlers.saveAndContinueHandler(
        request,
        h
      );

      expect(response.redirectedTo).toBe("/checker/document-search");
    });

    it("should redirect to reports if checklist is not 'pass'", async () => {
      const request = {
        payload: { checklist: "fail" },
      };

      const h = {
        redirect: jest.fn((url) => {
          return { redirectedTo: url };
        }),
      };

      const response = await SearchResultsHandlers.saveAndContinueHandler(
        request,
        h
      );

      expect(response.redirectedTo).toBe("/checker/non-compliance");
    });


  });
});
