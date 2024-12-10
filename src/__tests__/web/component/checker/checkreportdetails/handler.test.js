// File: handler.test.js
import { CheckReportHandlers } from "../../../../../web/component/checker/checkreportdetails/handler.js";
import spsReferralMainService from "../../../../../api/services/spsReferralMainService.js";
import apiService from "../../../../../api/services/apiService.js";

jest.mock("../../../../../api/services/spsReferralMainService.js");
jest.mock("../../../../../api/services/apiService.js");

const VIEW_PATH = "componentViews/checker/checkReport/reportDetails";

describe("CheckReportHandlers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getCheckDetails", () => {
    it("should return 400 when identifier is not available in yar", async () => {
      const mockRequest = {
        yar: {
          get: jest.fn().mockReturnValue(undefined),
        },
      };

      const h = {
        response: jest.fn().mockReturnThis(),
        code: jest.fn(),
      };

      await CheckReportHandlers.getCheckDetails(mockRequest, h);

      expect(h.response).toHaveBeenCalledWith({
        error: "Identifier is required",
      });
      expect(h.code).toHaveBeenCalledWith(400);
    });

    it("should return 404 when no data is found for the identifier", async () => {
      const mockRequest = {
        yar: {
          get: jest.fn().mockReturnValue("test-identifier"),
        },
      };

      spsReferralMainService.GetCompleteCheckDetails.mockResolvedValue(null);

      const h = {
        response: jest.fn().mockReturnThis(),
        code: jest.fn(),
      };

      await CheckReportHandlers.getCheckDetails(mockRequest, h);

      expect(h.response).toHaveBeenCalledWith(
        "No data found for the provided identifier"
      );
      expect(h.code).toHaveBeenCalledWith(404);
    });

    it("should return 500 on error", async () => {
      const mockRequest = {
        yar: {
          get: jest.fn().mockReturnValue("test-identifier"),
        },
      };

      spsReferralMainService.GetCompleteCheckDetails.mockRejectedValue(
        new Error("Test error")
      );

      const h = {
        response: jest.fn().mockReturnThis(), // Fixed response mock
        code: jest.fn().mockReturnThis(),
      };

      await CheckReportHandlers.getCheckDetails(mockRequest, h);

      expect(h.response).toHaveBeenCalledWith({
        error: "Internal Server Error",
        details: "Test error",
      });
      expect(h.code).toHaveBeenCalledWith(500);
    });
  });

  describe("conductSpsCheck", () => {
    it("should return 400 when identifier is not available in yar", async () => {
      const mockRequest = {
        yar: {
          get: jest.fn().mockReturnValue(undefined),
        },
      };

      const h = {
        response: jest.fn().mockReturnThis(),
        code: jest.fn(),
      };

      await CheckReportHandlers.conductSpsCheck(mockRequest, h);

      expect(h.response).toHaveBeenCalledWith({
        error: "Identifier is required",
      });
      expect(h.code).toHaveBeenCalledWith(400);
    });

    it("should handle PTD number and redirect when data is found", async () => {
      const mockRequest = {
        yar: {
          get: jest.fn().mockReturnValue("GB826812345678"),
          set: jest.fn(),
        },
      };

      const mockData = { ptdNumber: "GB826812345678" };

      apiService.getApplicationByPTDNumber.mockResolvedValue(mockData);

      const h = {
        redirect: jest.fn(),
      };

      await CheckReportHandlers.conductSpsCheck(mockRequest, h);

      expect(apiService.getApplicationByPTDNumber).toHaveBeenCalledWith(
        "GB826812345678",
        mockRequest
      );
      expect(mockRequest.yar.set).toHaveBeenCalledWith(
        "ptdNumber",
        "GB826812345678"
      );
      expect(mockRequest.yar.set).toHaveBeenCalledWith("data", mockData);
      expect(h.redirect).toHaveBeenCalledWith("/checker/search-results");
    });

    it("should handle application number and redirect when data is found", async () => {
      const mockRequest = {
        yar: {
          get: jest.fn().mockReturnValue("APP123456"),
          set: jest.fn(),
        },
      };

      const mockData = { applicationNumber: "APP123456" };

      apiService.getApplicationByApplicationNumber.mockResolvedValue(mockData);

      const h = {
        redirect: jest.fn(),
      };

      await CheckReportHandlers.conductSpsCheck(mockRequest, h);

      expect(apiService.getApplicationByApplicationNumber).toHaveBeenCalledWith(
        "APP123456",
        mockRequest
      );
      expect(mockRequest.yar.set).toHaveBeenCalledWith(
        "applicationNumber",
        "APP123456"
      );
      expect(mockRequest.yar.set).toHaveBeenCalledWith("data", mockData);
      expect(h.redirect).toHaveBeenCalledWith("/checker/search-results");
    });

    it("should return 404 when no data is found for PTD number", async () => {
      const mockRequest = {
        yar: {
          get: jest.fn().mockReturnValue("GB826812345678"),
        },
      };

      apiService.getApplicationByPTDNumber.mockResolvedValue(null);

      const h = {
        response: jest.fn().mockReturnThis(),
        code: jest.fn(),
      };

      await CheckReportHandlers.conductSpsCheck(mockRequest, h);

      expect(h.response).toHaveBeenCalledWith(
        "No data found for the provided PTD number"
      );
      expect(h.code).toHaveBeenCalledWith(404);
    });

    it("should return 404 when no data is found for application number", async () => {
      const mockRequest = {
        yar: {
          get: jest.fn().mockReturnValue("APP123456"),
        },
      };

      apiService.getApplicationByApplicationNumber.mockResolvedValue(null);

      const h = {
        response: jest.fn().mockReturnThis(),
        code: jest.fn(),
      };

      await CheckReportHandlers.conductSpsCheck(mockRequest, h);

      expect(h.response).toHaveBeenCalledWith(
        "No data found for the provided application number"
      );
      expect(h.code).toHaveBeenCalledWith(404);
    });

    it("should return 500 on error for PTD number", async () => {
      const mockRequest = {
        yar: {
          get: jest.fn().mockReturnValue("GB826812345678"),
        },
      };

      apiService.getApplicationByPTDNumber.mockRejectedValue(
        new Error("Test error")
      );

      const h = {
        response: jest.fn().mockReturnThis(),
        code: jest.fn(),
      };

      await CheckReportHandlers.conductSpsCheck(mockRequest, h);

      expect(h.response).toHaveBeenCalledWith({
        error: "Internal Server Error",
        details: "Test error",
      });
      expect(h.code).toHaveBeenCalledWith(500);
    });

    it("should return 500 on error for application number", async () => {
      const mockRequest = {
        yar: {
          get: jest.fn().mockReturnValue("APP123456"),
        },
      };

      apiService.getApplicationByApplicationNumber.mockRejectedValue(
        new Error("Test error")
      );

      const h = {
        response: jest.fn().mockReturnThis(),
        code: jest.fn(),
      };

      await CheckReportHandlers.conductSpsCheck(mockRequest, h);

      expect(h.response).toHaveBeenCalledWith({
        error: "Internal Server Error",
        details: "Test error",
      });
      expect(h.code).toHaveBeenCalledWith(500);
    });
  });
});
