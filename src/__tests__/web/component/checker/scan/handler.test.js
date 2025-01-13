import { ScanHandlers } from "../../../../../web/component/checker/scan/handler.js";
import apiService from "../../../../../api/services/apiService.js";

jest.mock("../../../../../api/services/apiService.js");

const SEARCH_RESULTS_PATH = "/checker/search-results";
const NOT_FOUND_VIEW_PATH =
  "componentViews/checker/documentsearch/documentNotFoundView";
const SCAN_VIEW_PATH = "componentViews/checker/scan/scanView";
const PAGE_TITLE = "Scan QR Code";

const mockData = {
  issuedDate: "2023-10-01",
  microchipNumber: "123456789",
  petName: "Buddy",
};

describe("Scan Handlers", () => {
  describe("getScan", () => {
    it("should return the scan view", async () => {
      const mockRequest = {};
      const mockH = {
        view: jest.fn((viewPath) => ({ viewPath })),
      };

      const response = await ScanHandlers.getScan(mockRequest, mockH);

      expect(response.viewPath).toBe(SCAN_VIEW_PATH);
      expect(mockH.view).toHaveBeenCalledWith(SCAN_VIEW_PATH);
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
    }, 10000);

    it("should redirect to search results for valid Application Ref", async () => {
      const applicationNumber = "ABCD1234";
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
    }, 10000);

    it("should return not found view for invalid QR code", async () => {
      const mockRequest = {
        payload: { qrCodeData: "invalid" },
      };
      const mockH = {
        view: jest.fn((viewPath, data) => ({ viewPath, data })),
      };

      const response = await ScanHandlers.postScan(mockRequest, mockH);

      expect(response.viewPath).toBe(NOT_FOUND_VIEW_PATH);
      expect(response.data).toEqual({
        searchValue: "invalid",
        pageTitle: PAGE_TITLE,
      });
    });
  });
});
