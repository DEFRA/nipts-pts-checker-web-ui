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

    it("should return 404 when no data is found for the identifier", async () => {
      const mockRequest = {
        yar: {
          get: jest.fn().mockReturnValue("test-identifier"),
        },
      };

      apiService.getApplicationByPTDNumber.mockResolvedValue(null);

      const h = {
        response: jest.fn().mockReturnThis(),
        code: jest.fn(),
      };

      await CheckReportHandlers.conductSpsCheck(mockRequest, h);

      expect(h.response).toHaveBeenCalledWith(
        "No data found for the provided identifier"
      );
      expect(h.code).toHaveBeenCalledWith(404);
    });

    it("should redirect when data is found", async () => {
      const mockRequest = {
        yar: {
          get: jest.fn().mockReturnValue("test-identifier"),
          set: jest.fn(),
        },
      };

      const mockData = { ptdNumber: "123" };

      apiService.getApplicationByPTDNumber.mockResolvedValue(mockData);

      const h = {
        redirect: jest.fn(),
      };

      await CheckReportHandlers.conductSpsCheck(mockRequest, h);

      expect(mockRequest.yar.set).toHaveBeenCalledWith("ptdNumber", "123");
      expect(mockRequest.yar.set).toHaveBeenCalledWith("data", mockData);
      expect(h.redirect).toHaveBeenCalledWith("/checker/search-results");
    });

    it("should return 500 on error", async () => {
      const mockRequest = {
        yar: {
          get: jest.fn().mockReturnValue("test-identifier"),
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
  });
});
