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

const setupMockRequest = (payload = {}) => ({
  payload,
  yar: { set: jest.fn() },
});

const setupMockH = () => ({
  view: jest.fn((viewPath, data) => ({ viewPath, data })),
  redirect: jest.fn((path) => ({ path })),
});

describe("Scan Handlers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getScan", () => {
    it("should return the scan view and set section", async () => {
      const mockRequest = setupMockRequest();
      const mockH = setupMockH();

      const response = await ScanHandlers.getScan(mockRequest, mockH);

      expect(response.viewPath).toBe(SCAN_VIEW_PATH);
      expect(mockH.view).toHaveBeenCalledWith(SCAN_VIEW_PATH);
      expect(headerData.section).toBe("scan");
    });
  });

  describe("getScanNotFound", () => {
    it("should return the not found view with correct data", async () => {
      const mockRequest = setupMockRequest();
      const mockH = setupMockH();

      const response = await ScanHandlers.getScanNotFound(mockRequest, mockH);

      expect(response.viewPath).toBe(NOT_FOUND_VIEW_PATH);
      expect(response.data).toEqual({
        pageTitle: "Pet Travel Scheme Test",
      });
      expect(headerData.section).toBe("scan");
    });
  });

  describe("postScan - PTD Tests", () => {
    const testValidPTD = async () => {
      const ptdNumber = "GB826ABCD12";
      const mockRequest = setupMockRequest({ qrCodeData: ptdNumber });
      const mockH = setupMockH();

      const ptdData = { ptdNumber, ...mockData };
      apiService.getApplicationByPTDNumber.mockResolvedValue(ptdData);

      const response = await ScanHandlers.postScan(mockRequest, mockH);

      expect(response.path).toBe(SEARCH_RESULTS_PATH);
      expect(mockH.redirect).toHaveBeenCalledWith(SEARCH_RESULTS_PATH);
      expect(mockRequest.yar.set).toHaveBeenCalledWith("ptdNumber", ptdNumber);
      expect(mockRequest.yar.set).toHaveBeenCalledWith("data", ptdData);
    };

    const testPTDNotFound = async () => {
      const ptdNumber = "GB826ABCD12";
      const mockRequest = setupMockRequest({ qrCodeData: ptdNumber });
      const mockH = setupMockH();

      const errorResponse = { error: "not_found" };
      apiService.getApplicationByPTDNumber.mockResolvedValue(errorResponse);

      const response = await ScanHandlers.postScan(mockRequest, mockH);

      expect(response.path).toBe(
        `/checker/scan/not-found?searchValue=${ptdNumber}`
      );
      expect(mockH.redirect).toHaveBeenCalledWith(
        `/checker/scan/not-found?searchValue=${ptdNumber}`
      );
    };

    it("should redirect to search results for valid PTD", testValidPTD);
    it("should handle PTD not found error", testPTDNotFound);
  });

  describe("postScan - Application Ref Tests", () => {
    const testValidApplicationRef = async () => {
      const applicationNumber = "ABCD12345";
      const mockRequest = setupMockRequest({ qrCodeData: applicationNumber });
      const mockH = setupMockH();

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
    };

    const testApplicationRefNotFound = async () => {
      const applicationNumber = "ABCD12345";
      const mockRequest = setupMockRequest({ qrCodeData: applicationNumber });
      const mockH = setupMockH();

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
    };

    it(
      "should redirect to search results for valid Application Ref",
      testValidApplicationRef
    );
    it(
      "should handle Application Ref not found error",
      testApplicationRefNotFound
    );
  });

  describe("postScan - Error Cases", () => {
    const testInvalidQRCode = async () => {
      const invalidQR = "invalid";
      const mockRequest = setupMockRequest({ qrCodeData: invalidQR });
      const mockH = setupMockH();

      const response = await ScanHandlers.postScan(mockRequest, mockH);

      expect(response.path).toBe(
        `/checker/scan/not-found?searchValue=${invalidQR}`
      );
      expect(mockH.redirect).toHaveBeenCalledWith(
        `/checker/scan/not-found?searchValue=${invalidQR}`
      );
    };

    const testAPIError = async () => {
      const ptdNumber = "GB826ABCD12";
      const mockRequest = setupMockRequest({ qrCodeData: ptdNumber });
      const mockH = setupMockH();

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
    };

    it("should handle invalid QR code format", testInvalidQRCode);
    it("should handle API errors", testAPIError);
  });
});
