import { ScanHandlers } from "../../../../../web/component/checker/scan/handler.js";
import apiService from "../../../../../api/services/apiService.js";
import headerData from "../../../../../web/helper/constants.js";
import DashboardMainModel from "../../../../../constants/dashBoardConstant.js";

jest.mock("../../../../../api/services/apiService.js");
jest.mock("../../../../../web/helper/constants.js");
jest.mock("../../../../../constants/dashBoardConstant.js", () => ({
  __esModule: true,
  default: {
    dashboardMainModelData: {
      pageTitle: "Pet Travel Scheme Test",
    },
  },
}));

const SEARCH_RESULTS_PATH = "/checker/search-results";
const SCAN_VIEW_PATH = "componentViews/checker/scan/scanView";
const NOT_FOUND_VIEW_PATH = "componentViews/checker/scan/scanNotFoundView";

const mockData = {
  issuedDate: "2023-10-01",
  microchipNumber: "123456789",
  petName: "Buddy",
};

describe("Scan Handlers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getScan", () => {
    it("should return the scan view and set section", async () => {
      const mockRequest = {};
      const mockH = {
        view: jest.fn((viewPath) => ({ viewPath })),
      };

      const response = await ScanHandlers.getScan(mockRequest, mockH);

      expect(response.viewPath).toBe(SCAN_VIEW_PATH);
      expect(mockH.view).toHaveBeenCalledWith(SCAN_VIEW_PATH);
      expect(headerData.section).toBe("scan");
    });
  });

  describe("getScanNotFound", () => {
    it("should return the not found view with correct data", async () => {
      const mockRequest = {};
      const mockH = {
        view: jest.fn((viewPath, data) => ({ viewPath, data })),
      };

      const response = await ScanHandlers.getScanNotFound(mockRequest, mockH);

      expect(response.viewPath).toBe(NOT_FOUND_VIEW_PATH);
      expect(response.data).toEqual({
        pageTitle: "Pet Travel Scheme Test",
      });
      expect(headerData.section).toBe("scan");
    });
  });

  describe("postScan", () => {
    it("should redirect to search results for valid PTD", async () => {
      const ptdNumber = "GB826ABCD12";
      const mockRequest = {
        payload: { qrCodeData: ptdNumber },
        yar: { set: jest.fn() },
      };
      const mockH = {
        redirect: jest.fn((path) => ({ path })),
      };

      const ptdData = { ptdNumber, ...mockData };
      apiService.getApplicationByPTDNumber.mockResolvedValue(ptdData);

      const response = await ScanHandlers.postScan(mockRequest, mockH);

      expect(response.path).toBe(SEARCH_RESULTS_PATH);
      expect(mockH.redirect).toHaveBeenCalledWith(SEARCH_RESULTS_PATH);
      expect(mockRequest.yar.set).toHaveBeenCalledWith("ptdNumber", ptdNumber);
      expect(mockRequest.yar.set).toHaveBeenCalledWith("data", ptdData);
    });

    it("should handle PTD not found error", async () => {
      const ptdNumber = "GB826ABCD12";
      const mockRequest = {
        payload: { qrCodeData: ptdNumber },
        yar: { set: jest.fn() },
      };
      const mockH = {
        redirect: jest.fn((path) => ({ path })),
      };

      const errorResponse = { error: "not_found" };
      apiService.getApplicationByPTDNumber.mockResolvedValue(errorResponse);

      const response = await ScanHandlers.postScan(mockRequest, mockH);

      expect(response.path).toBe(
        `/checker/scan/not-found?searchValue=${ptdNumber}`
      );
      expect(mockH.redirect).toHaveBeenCalledWith(
        `/checker/scan/not-found?searchValue=${ptdNumber}`
      );
    });

    it("should redirect to search results for valid Application Ref", async () => {
      const applicationNumber = "ABCD12345";
      const mockRequest = {
        payload: { qrCodeData: applicationNumber },
        yar: { set: jest.fn() },
      };
      const mockH = {
        redirect: jest.fn((path) => ({ path })),
      };

      const appData = { applicationNumber, ...mockData };
      apiService.getApplicationByApplicationNumber.mockResolvedValue(appData);

      const response = await ScanHandlers.postScan(mockRequest, mockH);

      expect(response.path).toBe(SEARCH_RESULTS_PATH);
      expect(mockH.redirect).toHaveBeenCalledWith(SEARCH_RESULTS_PATH);
      expect(mockRequest.yar.set).toHaveBeenCalledWith(
        "applicationNumber",
        applicationNumber
      );
      expect(mockRequest.yar.set).toHaveBeenCalledWith("data", appData);
    });

    it("should handle Application Ref not found error", async () => {
      const applicationNumber = "ABCD12345";
      const mockRequest = {
        payload: { qrCodeData: applicationNumber },
        yar: { set: jest.fn() },
      };
      const mockH = {
        redirect: jest.fn((path) => ({ path })),
      };

      const errorResponse = { error: "not_found" };
      apiService.getApplicationByApplicationNumber.mockResolvedValue(
        errorResponse
      );

      const response = await ScanHandlers.postScan(mockRequest, mockH);

      expect(response.path).toBe(
        `/checker/scan/not-found?searchValue=${applicationNumber}`
      );
      expect(mockH.redirect).toHaveBeenCalledWith(
        `/checker/scan/not-found?searchValue=${applicationNumber}`
      );
    });

    it("should handle invalid QR code format", async () => {
      const invalidQR = "invalid";
      const mockRequest = {
        payload: { qrCodeData: invalidQR },
      };
      const mockH = {
        redirect: jest.fn((path) => ({ path })),
      };

      const response = await ScanHandlers.postScan(mockRequest, mockH);

      expect(response.path).toBe(
        `/checker/scan/not-found?searchValue=${invalidQR}`
      );
      expect(mockH.redirect).toHaveBeenCalledWith(
        `/checker/scan/not-found?searchValue=${invalidQR}`
      );
    });

    it("should handle API errors", async () => {
      const ptdNumber = "GB826ABCD12";
      const mockRequest = {
        payload: { qrCodeData: ptdNumber },
      };
      const mockH = {
        redirect: jest.fn((path) => ({ path })),
      };

      apiService.getApplicationByPTDNumber.mockRejectedValue(
        new Error("API Error")
      );

      const response = await ScanHandlers.postScan(mockRequest, mockH);

      expect(response.path).toBe(
        `/checker/scan/not-found?searchValue=${ptdNumber}`
      );
      expect(mockH.redirect).toHaveBeenCalledWith(
        `/checker/scan/not-found?searchValue=${ptdNumber}`
      );
    });
  });
});
