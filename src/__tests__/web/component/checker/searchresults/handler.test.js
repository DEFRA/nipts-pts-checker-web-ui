"use strict";

jest.mock("../../../../../api/services/apiService.js", () => ({
  __esModule: true,
  default: {
    recordCheckOutCome: jest.fn(),
  },
}));

jest.mock(
  "../../../../../web/component/checker/searchresults/validate.js",
  () => ({
    __esModule: true,
    validatePassOrFail: jest.fn(),
  })
);

import { SearchResultsHandlers } from "../../../../../web/component/checker/searchresults/handler.js";
import { validatePassOrFail } from "../../../../../web/component/checker/searchresults/validate.js";
import apiService from "../../../../../api/services/apiService.js";
import { CheckOutcomeConstants } from "../../../../../constants/checkOutcomeConstant.js";
import DashboardMainModel from "../../../../../constants/dashBoardConstant.js";
import errorMessages from "../../../../../web/component/checker/searchresults/errorMessages.js";

const VIEW_PATH = "componentViews/checker/searchresults/searchResultsView";

const formatPtdNumber = (ptdNumber) => {
  if (!ptdNumber) return "";

  const PTD_LENGTH = 11;
  const PTD_PREFIX_LENGTH = 5;
  const PTD_MID_LENGTH = 8;

  return (
    `${ptdNumber.padStart(PTD_LENGTH, "0").slice(0, PTD_PREFIX_LENGTH)} ` +
    `${ptdNumber
      .padStart(PTD_LENGTH, "0")
      .slice(PTD_PREFIX_LENGTH, PTD_MID_LENGTH)} ` +
    `${ptdNumber.padStart(PTD_LENGTH, "0").slice(PTD_MID_LENGTH)}`
  );
};

describe("SearchResultsHandlers", () => {
  let request;
  let h;

  beforeEach(() => {
    request = {
      payload: {},
      yar: {
        get: jest.fn(),
        set: jest.fn(),
        clear: jest.fn(),
      },
    };
    h = {
      view: jest.fn(),
      redirect: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getSearchResultsHandler", () => {
    it("should return view with microchipNumber and data from session", async () => {
      const mockMicrochipNumber = "123456789012345";
      const mockData = { some: "data" };

      request = {
        yar: {
          get: jest.fn((key) => {
            if (key === "microchipNumber") return mockMicrochipNumber;
            if (key === "data") return mockData;
            return null;
          }),
        },
      };

      h = {
        view: jest.fn((viewPath, data) => ({
          viewPath,
          data,
        })),
      };

      const pageTitle = DashboardMainModel.dashboardMainModelData.pageTitle;
      const response = await SearchResultsHandlers.getSearchResultsHandler(
        request,
        h
      );

      expect(request.yar.get).toHaveBeenCalledWith("microchipNumber");
      expect(request.yar.get).toHaveBeenCalledWith("data");
      expect(h.view).toHaveBeenCalledWith(VIEW_PATH, {
        microchipNumber: mockMicrochipNumber,
        pageTitle,
        data: mockData,
        checklist: {},
      });
      expect(response.viewPath).toBe(VIEW_PATH);
    });

    it("should format ptdNumber correctly when present", async () => {
      const mockMicrochipNumber = "123456789012345";
      const mockData = { ptdNumber: "12345678901" };

      request.yar.get.mockImplementation((key) => {
        if (key === "microchipNumber") return mockMicrochipNumber;
        if (key === "data") return mockData;
        return null;
      });

      await SearchResultsHandlers.getSearchResultsHandler(request, h);

      const expectedFormat = formatPtdNumber("12345678901");
      expect(h.view).toHaveBeenCalledWith(
        VIEW_PATH,
        expect.objectContaining({
          data: expect.objectContaining({
            ptdFormatted: expectedFormat,
          }),
        })
      );
    });

    it("should format ptdNumber correctly when short", async () => {
      const mockMicrochipNumber = "123456789012345";
      const mockData = { ptdNumber: "123" };

      request.yar.get.mockImplementation((key) => {
        if (key === "microchipNumber") return mockMicrochipNumber;
        if (key === "data") return mockData;
        return null;
      });

      await SearchResultsHandlers.getSearchResultsHandler(request, h);

      const expectedFormat = formatPtdNumber("123");
      expect(h.view).toHaveBeenCalledWith(
        VIEW_PATH,
        expect.objectContaining({
          data: expect.objectContaining({
            ptdFormatted: expectedFormat,
          }),
        })
      );
    });

    it("should handle empty ptdNumber", async () => {
      const mockMicrochipNumber = "123456789012345";
      const mockData = { ptdNumber: "" };

      request.yar.get.mockImplementation((key) => {
        if (key === "microchipNumber") return mockMicrochipNumber;
        if (key === "data") return mockData;
        return null;
      });

      await SearchResultsHandlers.getSearchResultsHandler(request, h);

      expect(h.view).toHaveBeenCalledWith(
        VIEW_PATH,
        expect.objectContaining({
          data: expect.objectContaining({
            ptdFormatted: "",
          }),
        })
      );
    });

    it("should set ptdFormatted to empty string when data object has no ptdNumber", async () => {
      const mockMicrochipNumber = "123456789012345";
      const mockData = {};

      request.yar.get.mockImplementation((key) => {
        if (key === "microchipNumber") return mockMicrochipNumber;
        if (key === "data") return mockData;
        return null;
      });

      await SearchResultsHandlers.getSearchResultsHandler(request, h);

      expect(h.view).toHaveBeenCalledWith(
        VIEW_PATH,
        expect.objectContaining({
          data: expect.objectContaining({
            ptdFormatted: "",
          }),
        })
      );
    });

    it("should return view with microchipNumber data and nonComplianceToSearchResults navigation from session", async () => {
      const mockMicrochipNumber = "123456789012345";
      const mockData = { some: "data" };
      const nonComplianceToSearchResults = true;

      request = {
        yar: {
          get: jest.fn((key) => {
            if (key === "microchipNumber") return mockMicrochipNumber;
            if (key === "data") return mockData;
            if (key === "nonComplianceToSearchResults")
              return nonComplianceToSearchResults;
            return null;
          }),
          clear: jest.fn(),
        },
      };

      h = {
        view: jest.fn((viewPath, data) => ({
          viewPath,
          data,
        })),
      };

      const response = await SearchResultsHandlers.getSearchResultsHandler(
        request,
        h
      );

      expect(request.yar.get).toHaveBeenCalledWith("microchipNumber");
      expect(request.yar.get).toHaveBeenCalledWith("data");
      expect(request.yar.get).toHaveBeenCalledWith(
        "nonComplianceToSearchResults"
      );
      expect(h.view).toHaveBeenCalledWith(VIEW_PATH, {
        microchipNumber: mockMicrochipNumber,
        pageTitle: DashboardMainModel.dashboardMainModelData.pageTitle,
        data: mockData,
        checklist: CheckOutcomeConstants.Fail,
      });
      expect(request.yar.clear).toHaveBeenCalledWith(
        "nonComplianceToSearchResults"
      );
    });
  });

  describe("saveAndContinueHandler", () => {
    beforeEach(() => {
      validatePassOrFail.mockImplementation((value) => {
        if (!value) return { isValid: false, error: "Missing value" };
        return { isValid: true };
      });

      apiService.recordCheckOutCome.mockResolvedValue({});
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return a validation error if checklist is invalid", async () => {
      request.payload = { checklist: "" };
      request.yar.get.mockImplementation((key) => {
        if (key === "microchipNumber") return "123456789012345";
        if (key === "data") return { ptdNumber: "123" };
        return null;
      });

      validatePassOrFail.mockReturnValue({
        isValid: false,
        error: errorMessages.passOrFailOption.empty,
      });

      await SearchResultsHandlers.saveAndContinueHandler(request, h);

      expect(h.view).toHaveBeenCalledWith(
        VIEW_PATH,
        expect.objectContaining({
          error: errorMessages.passOrFailOption.empty,
          errorSummary: expect.arrayContaining([
            expect.objectContaining({
              fieldId: "checklist",
              message: errorMessages.passOrFailOption.empty,
            }),
          ]),
        })
      );
    });
  });
});
