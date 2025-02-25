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
const PTD_LENGTH = 11;
const PTD_PREFIX_LENGTH = 5;
const PTD_MID_LENGTH = 8;

const formatPtdNumber = (ptdNumber) => {
  if (!ptdNumber) {
    return "";
  }

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
      view: jest.fn(() => {
        return { viewRendered: true };
      }),
      redirect: jest.fn(() => {
        return { redirected: true };
      }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getSearchResultsHandler", () => {
    test("should return view with microchipNumber and data from session", async () => {
      const mockMicrochipNumber = "123456789012345";
      const mockData = { some: "data" };

      request = {
        yar: {
          get: jest.fn((key) => {
            if (key === "microchipNumber") {
              return mockMicrochipNumber;
            }
            if (key === "data") {
              return mockData;
            }
            return null;
          }),
        },
      };

      h = {
        view: jest.fn(() => {
          return { viewRendered: true };
        }),
      };

      const pageTitle = DashboardMainModel.dashboardMainModelData.pageTitle;
      await SearchResultsHandlers.getSearchResultsHandler(request, h);

      expect(request.yar.get).toHaveBeenCalledWith("microchipNumber");
      expect(request.yar.get).toHaveBeenCalledWith("data");
      expect(h.view).toHaveBeenCalledWith(VIEW_PATH, {
        microchipNumber: mockMicrochipNumber,
        pageTitle,
        data: mockData,
        checklist: {},
      });
    });

    test("should format ptdNumber correctly when present", async () => {
      const mockMicrochipNumber = "123456789012345";
      const mockData = { ptdNumber: "12345678901" };

      request.yar.get.mockImplementation((key) => {
        if (key === "microchipNumber") {
          return mockMicrochipNumber;
        }
        if (key === "data") {
          return mockData;
        }
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

    test("should format ptdNumber correctly when short", async () => {
      const mockMicrochipNumber = "123456789012345";
      const mockData = { ptdNumber: "123" };

      request.yar.get.mockImplementation((key) => {
        if (key === "microchipNumber") {
          return mockMicrochipNumber;
        }
        if (key === "data") {
          return mockData;
        }
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

    test("should handle empty ptdNumber", async () => {
      const mockMicrochipNumber = "123456789012345";
      const mockData = { ptdNumber: "" };

      request.yar.get.mockImplementation((key) => {
        if (key === "microchipNumber") {
          return mockMicrochipNumber;
        }
        if (key === "data") {
          return mockData;
        }
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

    test("should set ptdFormatted to empty string when data object has no ptdNumber", async () => {
      const mockMicrochipNumber = "123456789012345";
      const mockData = {};

      request.yar.get.mockImplementation((key) => {
        if (key === "microchipNumber") {
          return mockMicrochipNumber;
        }
        if (key === "data") {
          return mockData;
        }
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

    test("should return view with nonComplianceToSearchResults navigation", async () => {
      const mockMicrochipNumber = "123456789012345";
      const mockData = { some: "data" };
      const nonComplianceToSearchResults = true;

      request = {
        yar: {
          get: jest.fn((key) => {
            if (key === "microchipNumber") {
              return mockMicrochipNumber;
            }
            if (key === "data") {
              return mockData;
            }
            if (key === "nonComplianceToSearchResults") {
              return nonComplianceToSearchResults;
            }
            return null;
          }),
          clear: jest.fn(),
        },
      };

      h = {
        view: jest.fn(() => {
          return { viewRendered: true };
        }),
      };

      await SearchResultsHandlers.getSearchResultsHandler(request, h);

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
    test("should return validation error if checklist is invalid", async () => {
      request.payload = { checklist: "" };
      request.yar.get.mockImplementation((key) => {
        if (key === "microchipNumber") {
          return "123456789012345";
        }
        if (key === "data") {
          return { ptdNumber: "123" };
        }
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

    test("should return validation error if data state is active", async () => {
      request.payload.checklist = "";
      const mockData = { documentState: "active", ptdNumber: "GB8262C39F9" };
      request.yar.get.mockImplementation((key) => {
        if (key === "data") {
          return mockData;
        }
        return null;
      });
      validatePassOrFail.mockReturnValueOnce({
        isValid: false,
        error: errorMessages.passOrFailOption.empty,
      });

      await SearchResultsHandlers.saveAndContinueHandler(request, h);

      expect(h.view).toHaveBeenCalledWith(
        VIEW_PATH,
        expect.objectContaining({
          error: errorMessages.passOrFailOption.empty,
          errorSummary: [
            {
              fieldId: "checklist",
              message: errorMessages.passOrFailOption.empty,
            },
          ],
          formSubmitted: true,
          data: expect.objectContaining({
            ptdFormatted: expect.any(String),
          }),
        })
      );
    });

    test("should return error if documentstate is revoked", async () => {
      request.payload.checklist = "";
      const mockData = { documentState: "revoked", ptdNumber: "GB8262C39F9" };
      request.yar.get.mockImplementation((key) => {
        if (key === "data") {
          return mockData;
        }
        return null;
      });
      validatePassOrFail.mockReturnValueOnce({
        isValid: false,
        error: errorMessages.passOrFailOption.empty,
      });

      await SearchResultsHandlers.saveAndContinueHandler(request, h);

      expect(h.view).toHaveBeenCalledWith(
        VIEW_PATH,
        expect.objectContaining({
          error: errorMessages.passOrFailOption.empty,
          errorSummary: [
            {
              fieldId: "checklist",
              message: errorMessages.passOrFailOption.empty,
            },
          ],
          formSubmitted: true,
          data: expect.objectContaining({
            ptdFormatted: expect.any(String),
          }),
        })
      );
    });

    test("should redirect to dashboard if checks pass", async () => {
      request.payload.checklist = CheckOutcomeConstants.Pass;
      const mockData = {
        documentState: "active",
        ptdNumber: "GB8262C39F9",
        applicationId: "app123",
      };

      const mockSailingSlot = {
        departureDate: "12/10/2023",
        sailingHour: "14",
        sailingMinutes: "30",
        selectedRoute: { id: "route123" },
        selectedRouteOption: { id: "option456" },
        routeFlight: "FL1234",
      };

      request.yar.get.mockImplementation((key) => {
        if (key === "data") {
          return mockData;
        }
        if (key === "currentSailingSlot") {
          return mockSailingSlot;
        }
        if (key === "isGBCheck") {
          return true;
        }
        if (key === "checkerId") {
          return "checker123";
        }
        return null;
      });

      validatePassOrFail.mockReturnValueOnce({ isValid: true });
      apiService.recordCheckOutCome.mockResolvedValueOnce({});

      await SearchResultsHandlers.saveAndContinueHandler(request, h);

      expect(apiService.recordCheckOutCome).toHaveBeenCalledWith(
        expect.objectContaining({
          applicationId: "app123",
          checkOutcome: CheckOutcomeConstants.Pass,
          isGBCheck: true,
          checkerId: "checker123",
        }),
        request
      );

      expect(request.yar.clear).toHaveBeenCalledWith("IsFailSelected");
      expect(request.yar.set).toHaveBeenCalledWith("successConfirmation", true);
      expect(h.redirect).toHaveBeenCalledWith("/checker/dashboard");
    });

    test("should handle API error when recording check outcome", async () => {
      request.payload.checklist = CheckOutcomeConstants.Pass;
      const mockData = {
        documentState: "active",
        ptdNumber: "GB8262C39F9",
        applicationId: "app123",
      };

      const mockSailingSlot = {
        departureDate: "12/10/2023",
        sailingHour: "14",
        sailingMinutes: "30",
        selectedRoute: { id: "route123" },
        selectedRouteOption: { id: "option456" },
      };

      request.yar.get.mockImplementation((key) => {
        if (key === "data") {
          return mockData;
        }
        if (key === "currentSailingSlot") {
          return mockSailingSlot;
        }
        if (key === "isGBCheck") {
          return true;
        }
        if (key === "checkerId") {
          return "checker123";
        }
        if (key === "microchipNumber") {
          return "123456789012345";
        }
        return null;
      });

      validatePassOrFail.mockReturnValueOnce({ isValid: true });
      apiService.recordCheckOutCome.mockResolvedValueOnce({
        error: "API Error",
      });

      await SearchResultsHandlers.saveAndContinueHandler(request, h);

      expect(h.view).toHaveBeenCalledWith(
        VIEW_PATH,
        expect.objectContaining({
          error: errorMessages.serviceError.message,
          errorSummary: [
            {
              fieldId: "unexpected",
              message: errorMessages.serviceError.message,
              dispalyAs: "text",
            },
          ],
          formSubmitted: true,
          checklist: CheckOutcomeConstants.Pass,
        })
      );
    });

    test("should redirect to non-compliance if checks fail", async () => {
      request.payload.checklist = CheckOutcomeConstants.Fail;
      const mockData = { documentState: "active", ptdNumber: "GB8262C39F9" };

      request.yar.get.mockImplementation((key) => {
        if (key === "data") {
          return mockData;
        }
        return null;
      });

      validatePassOrFail.mockReturnValueOnce({ isValid: true });

      await SearchResultsHandlers.saveAndContinueHandler(request, h);

      expect(request.yar.set).toHaveBeenCalledWith("IsFailSelected", true);
      expect(h.redirect).toHaveBeenCalledWith("/checker/non-compliance");
    });

    test("should force Fail if documentState is rejected", async () => {
      request.payload.checklist = CheckOutcomeConstants.Pass;
      const mockData = { documentState: "rejected", ptdNumber: "GB8262C39F9" };

      request.yar.get.mockImplementation((key) => {
        if (key === "data") {
          return mockData;
        }
        return null;
      });

      validatePassOrFail.mockReturnValueOnce({ isValid: true });

      await SearchResultsHandlers.saveAndContinueHandler(request, h);

      expect(request.yar.set).toHaveBeenCalledWith("IsFailSelected", true);
      expect(h.redirect).toHaveBeenCalledWith("/checker/non-compliance");
    });

    test("should handle unexpected errors", async () => {
      request.payload.checklist = CheckOutcomeConstants.Pass;
      const mockData = {
        documentState: "active",
        ptdNumber: "GB8262C39F9",
        applicationId: "app123",
      };

      request.yar.get.mockImplementation((key) => {
        if (key === "data") {
          return mockData;
        }
        if (key === "currentSailingSlot") {
          throw new Error("Unexpected error");
        }
        return null;
      });

      validatePassOrFail.mockReturnValueOnce({ isValid: true });

      await SearchResultsHandlers.saveAndContinueHandler(request, h);

      expect(h.view).toHaveBeenCalledWith(VIEW_PATH, {
        error: "An error occurred while processing your request",
        errorSummary: [
          { fieldId: "general", message: "An unexpected error occurred" },
        ],
      });
    });
  });
});
