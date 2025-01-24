// File: handler.test.js
import { CheckReportHandlers } from "../../../../../web/component/checker/checkreportdetails/handler.js";
import spsReferralMainService from "../../../../../api/services/spsReferralMainService.js";
import apiService from "../../../../../api/services/apiService.js";

jest.mock("../../../../../api/services/spsReferralMainService.js");
jest.mock("../../../../../api/services/apiService.js");

const testError = "Test error";
const internalServerError = "Internal Server Error";
const errorCode404 = 404;
const errorCode500 = 500;
const errorCode400 = 400;

const validGuid = "valid-guid";
const checkOutcome = "Passenger referred to DAERA/SPS at NI port";
const checkerName = "Checker Name";
const reportDetailsView = "componentViews/checker/checkReport/reportDetails";
const referralReason = "Potential commercial movement";
const dateNotAvailable = "Not available";
const searchResultsPage = "/checker/search-results";

describe("CheckReportHandlers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getCheckDetails", () => {
    it("should return 404 when no data is found for the provided CheckSummaryId", async () => {
      const mockRequest = {
        yar: {
          get: jest.fn().mockReturnValue("invalid-guid"),
        },
      };

      spsReferralMainService.GetCompleteCheckDetails.mockResolvedValue(null);

      const h = {
        response: jest.fn().mockReturnThis(),
        code: jest.fn(),
      };

      await CheckReportHandlers.getCheckDetails(mockRequest, h);

      expect(h.response).toHaveBeenCalledWith(
        "No data found for the provided CheckSummaryId"
      );
      expect(h.code).toHaveBeenCalledWith(errorCode404);
    });

    it("should display microchip number when reason for referral includes microchip mismatch", async () => {
      const mockRequest = {
        yar: {
          get: jest.fn().mockReturnValue(validGuid),
        },
      };

      const mockCheckDetails = {
        dateAndTimeChecked: "2024-12-13 14:22:32",
        ptdNumber: "PTD12345",
        applicationReference: null,
        checkOutcome: [checkOutcome],
        reasonForReferral: ["Microchip number does not match the PTD"],
        microchipNumber: "1234567890",
        additionalComments: ["Comment 1"],
        gbCheckerName: checkerName,
        route: "Route A",
        scheduledDepartureDate: "2024-12-15",
        scheduledDepartureTime: "14:00:00",
      };

      spsReferralMainService.GetCompleteCheckDetails.mockResolvedValue(
        mockCheckDetails
      );

      const h = {
        view: jest.fn(),
      };

      await CheckReportHandlers.getCheckDetails(mockRequest, h);

      const expectedFormattedDetails = {
        reference: "PTD12345",
        checkOutcome: [checkOutcome],
        reasonForReferral: ["Microchip number does not match the PTD"],
        microchipNumber: "1234567890",
        additionalComments: ["Comment 1"],
        gbCheckerName: checkerName,
        dateTimeChecked: "13/12/2024 14:22",
        route: "Route A",
        scheduledDepartureDate: "15/12/2024",
        scheduledDepartureTime: "14:00",
      };

      expect(h.view).toHaveBeenCalledWith(
        reportDetailsView,
        {
          checkDetails: expectedFormattedDetails,
        }
      );
    });

    it("should not display microchip number when reason for referral does not include microchip mismatch", async () => {
      const mockRequest = {
        yar: {
          get: jest.fn().mockReturnValue(validGuid),
        },
      };

      const mockCheckDetails = {
        dateAndTimeChecked: "2024-12-13 14:22:32",
        ptdNumber: "PTD12345",
        applicationReference: null,
        checkOutcome: [checkOutcome],
        reasonForReferral: [referralReason],
        microchipNumber: "1234567890",
        additionalComments: ["Comment 1"],
        gbCheckerName: checkerName,
        route: "Route A",
        scheduledDepartureDate: "2024-12-15",
        scheduledDepartureTime: "14:00:00",
      };

      spsReferralMainService.GetCompleteCheckDetails.mockResolvedValue(
        mockCheckDetails
      );

      const h = {
        view: jest.fn(),
      };

      await CheckReportHandlers.getCheckDetails(mockRequest, h);

      const expectedFormattedDetails = {
        reference: "PTD12345",
        checkOutcome: [checkOutcome],
        reasonForReferral: [referralReason],
        microchipNumber: null,
        additionalComments: ["Comment 1"],
        gbCheckerName: checkerName,
        dateTimeChecked: "13/12/2024 14:22",
        route: "Route A",
        scheduledDepartureDate: "15/12/2024",
        scheduledDepartureTime: "14:00",
      };

      expect(h.view).toHaveBeenCalledWith(
        reportDetailsView,
        {
          checkDetails: expectedFormattedDetails,
        }
      );
    });

    it("should handle missing dates and times gracefully", async () => {
      const mockRequest = {
        yar: {
          get: jest.fn().mockReturnValue(validGuid),
        },
      };

      const mockCheckDetails = {
        ptdNumber: "PTD12345",
        checkOutcome: [checkOutcome],
        reasonForReferral: [referralReason],
        gbCheckerName: checkerName,
        route: "Route A",
      };

      spsReferralMainService.GetCompleteCheckDetails.mockResolvedValue(
        mockCheckDetails
      );

      const h = {
        view: jest.fn(),
      };

      await CheckReportHandlers.getCheckDetails(mockRequest, h);

      const expectedFormattedDetails = {
        reference: "PTD12345",
        checkOutcome: [checkOutcome],
        reasonForReferral: [referralReason],
        microchipNumber: null,
        additionalComments: ["None"],
        gbCheckerName: checkerName,
        dateTimeChecked: dateNotAvailable,
        route: "Route A",
        scheduledDepartureDate: dateNotAvailable,
        scheduledDepartureTime: dateNotAvailable,
      };

      expect(h.view).toHaveBeenCalledWith(
        reportDetailsView,
        {
          checkDetails: expectedFormattedDetails,
        }
      );
    });

    it("should return 500 when there is an error in GetCompleteCheckDetails", async () => {
      const mockRequest = {
        yar: {
          get: jest.fn().mockReturnValue(validGuid),
        },
      };

      spsReferralMainService.GetCompleteCheckDetails.mockRejectedValue(
        new Error(testError)
      );

      const h = {
        response: jest.fn().mockReturnThis(),
        code: jest.fn(),
      };

      await CheckReportHandlers.getCheckDetails(mockRequest, h);

      expect(h.response).toHaveBeenCalledWith({
        error: internalServerError,
        details: testError,
      });
      expect(h.code).toHaveBeenCalledWith(errorCode500);
    });
  });

  describe("conductSpsCheck", () => {
    it("should return 400 when identifier is missing in yar", async () => {
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
      expect(h.code).toHaveBeenCalledWith(errorCode400);
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
      expect(h.redirect).toHaveBeenCalledWith(searchResultsPage);
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
      expect(h.redirect).toHaveBeenCalledWith(searchResultsPage);
    });

    it("should return 404 when no data found for PTD number", async () => {
      const mockRequest = {
        yar: {
          get: jest.fn().mockReturnValue("GB826812345678"),
          set: jest.fn(),
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
      expect(h.code).toHaveBeenCalledWith(errorCode404);
    });

    it("should return 404 when no data found for application number", async () => {
      const mockRequest = {
        yar: {
          get: jest.fn().mockReturnValue("APP123456"),
          set: jest.fn(),
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
      expect(h.code).toHaveBeenCalledWith(errorCode404);
    });

    it("should return 500 when an error occurs in conductSpsCheck", async () => {
      const mockRequest = {
        yar: {
          get: jest.fn().mockReturnValue("APP123456"),
          set: jest.fn(),
        },
      };
    
      const errorMessage = "Something went wrong";
      apiService.getApplicationByApplicationNumber.mockRejectedValue(new Error(errorMessage));
    
      const h = {
        response: jest.fn().mockReturnThis(),
        code: jest.fn(),
      };
    
      await CheckReportHandlers.conductSpsCheck(mockRequest, h);
    
      expect(h.response).toHaveBeenCalledWith({
        error: "Internal Server Error",
        details: errorMessage,
      });
      expect(h.code).toHaveBeenCalledWith(errorCode500);
    });
    
  });
});
