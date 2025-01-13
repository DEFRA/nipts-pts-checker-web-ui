import { ScanHandlers } from "../../../../../web/component/checker/scan/handler.js";
import apiService from "../../../../../api/services/apiService.js";
jest.mock("../../../../../api/services/apiService.js");

describe("Scan Handlers", () => {
  describe("getScan", () => {
    it("should return the scan view", async () => {
      const mockRequest = {};
      const mockH = {
        view: jest.fn((viewPath) => ({ viewPath })),
      };

      const response = await ScanHandlers.getScan(mockRequest, mockH);

      expect(response.viewPath).toBe("componentViews/checker/scan/scanView");
      expect(mockH.view).toHaveBeenCalledWith(
        "componentViews/checker/scan/scanView"
      );
    });
  });

  describe("postScan", () => {
    it("should redirect to search results for valid PTD", async () => {
      const mockRequest = {
        payload: { qrCodeData: "GB826ABCD12" },
        yar: { set: jest.fn() },
      };
      const mockH = {
        redirect: jest.fn((path) => ({ path })),
      };

      apiService.getApplicationByPTDNumber.mockResolvedValue({
        ptdNumber: "GB826ABCD12",
        issuedDate: "2023-10-01",
        microchipNumber: "123456789",
        petName: "Buddy",
      });

      const response = await ScanHandlers.postScan(mockRequest, mockH);

      expect(response.path).toBe("/checker/search-results");
      expect(mockH.redirect).toHaveBeenCalledWith("/checker/search-results");
      expect(mockRequest.yar.set).toHaveBeenCalledWith(
        "ptdNumber",
        "GB826ABCD12"
      );
      expect(mockRequest.yar.set).toHaveBeenCalledWith("data", {
        ptdNumber: "GB826ABCD12",
        issuedDate: "2023-10-01",
        microchipNumber: "123456789",
        petName: "Buddy",
      });
    }, 10000);

    it("should redirect to search results for valid Application Ref", async () => {
      const mockRequest = {
        payload: { qrCodeData: "ABCD1234" },
        yar: { set: jest.fn() },
      };
      const mockH = {
        redirect: jest.fn((path) => ({ path })),
      };

      apiService.getApplicationByApplicationNumber.mockResolvedValue({
        applicationNumber: "ABCD1234",
        issuedDate: "2023-10-01",
        microchipNumber: "123456789",
        petName: "Buddy",
      });

      const response = await ScanHandlers.postScan(mockRequest, mockH);

      expect(response.path).toBe("/checker/search-results");
      expect(mockH.redirect).toHaveBeenCalledWith("/checker/search-results");
      expect(mockRequest.yar.set).toHaveBeenCalledWith(
        "applicationNumber",
        "ABCD1234"
      );
      expect(mockRequest.yar.set).toHaveBeenCalledWith("data", {
        applicationNumber: "ABCD1234",
        issuedDate: "2023-10-01",
        microchipNumber: "123456789",
        petName: "Buddy",
      });
    }, 10000);

    it("should return not found view for invalid QR code", async () => {
      const mockRequest = {
        payload: { qrCodeData: "invalid" },
      };
      const mockH = {
        view: jest.fn((viewPath, data) => ({ viewPath, data })),
      };

      const response = await ScanHandlers.postScan(mockRequest, mockH);

      expect(response.viewPath).toBe(
        "componentViews/checker/documentsearch/documentNotFoundView"
      );
      expect(response.data).toEqual({
        searchValue: "invalid",
        pageTitle: "Scan QR Code",
      });
    });
  });
});
