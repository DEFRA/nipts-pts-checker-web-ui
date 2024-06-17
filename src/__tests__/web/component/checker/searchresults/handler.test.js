"use strict";

import { MicrochipHandlers } from "../../../../../web/component/checker/searchresults/handler.js";

describe("MicrochipHandlers", () => {
  describe("getMicrochipDataHandler", () => {
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
        await MicrochipHandlers.getMicrochipDataHandler.index.handler(
          request,
          h
        );

      expect(request.yar.get).toHaveBeenCalledWith("microchipNumber");
      expect(request.yar.get).toHaveBeenCalledWith("data");
      expect(h.view).toHaveBeenCalledWith(
        "componentViews/checker/searchresults/searchResultsView",
        {
          microchipNumber: mockMicrochipNumber,
          data: mockData,
        }
      );
      expect(response.viewPath).toBe(
        "componentViews/checker/searchresults/searchResultsView"
      );
      expect(response.data).toEqual({
        microchipNumber: mockMicrochipNumber,
        data: mockData,
      });
    });
  });
});
