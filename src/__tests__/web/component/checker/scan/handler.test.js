import { ScanHandlers } from "../../../../../web/component/checker/scan/handler.js";
import apiService from "../../../../../api/services/apiService.js";
import headerData from "../../../../../web/helper/constants.js";

const pageTitle = "Pet Travel Scheme Test";

jest.mock("../../../../../api/services/apiService.js");
jest.mock("../../../../../web/helper/constants.js");
jest.mock("../../../../../constants/dashBoardConstant.js", () => ({
  __esModule: true,
  default: {
    dashboardMainModelData: {
      pageTitle: pageTitle,
    },
  },
}));

const SEARCH_RESULTS_PATH = "/checker/search-results";
const SCAN_VIEW_PATH = "componentViews/checker/scan/scanView";
const NOT_FOUND_VIEW_PATH = "componentViews/checker/scan/scanNotFoundView";
const ALLOW_CAMERA_PERMISSIONS = "componentViews/checker/scan/allowCameraPermissions";

const mockData = {
  issuedDate: "2023-10-01",
  microchipNumber: "123456789",
  petName: "Buddy",
};

const testGetScan = async () => {
  const mockRequest = { yar: { set: jest.fn() } };
  const mockH = { view: jest.fn((viewPath) => ({ viewPath })) };

  const response = await ScanHandlers.getScan(mockRequest, mockH);

  expect(response.viewPath).toBe(SCAN_VIEW_PATH);
  expect(mockH.view).toHaveBeenCalledWith(SCAN_VIEW_PATH);
  expect(headerData.section).toBe("scan");
};

const testGetScanNotFound = async () => {
  const mockRequest = { yar: { set: jest.fn() } };
  const mockH = { view: jest.fn((viewPath, data) => ({ viewPath, data })) };

  const response = await ScanHandlers.getScanNotFound(mockRequest, mockH);

  expect(response.viewPath).toBe(NOT_FOUND_VIEW_PATH);
  expect(response.data).toEqual({
    pageTitle: pageTitle,
  });
  expect(headerData.section).toBe("scan");
};

const testValidPTD = async () => {
  const ptdNumber = "GB826ABCD12";
  const mockRequest = {
    payload: { qrCodeData: ptdNumber },
    yar: { set: jest.fn() },
  };
  const mockH = { redirect: jest.fn((path) => ({ path })) };

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
  const mockRequest = {
    payload: { qrCodeData: ptdNumber },
    yar: { set: jest.fn() },
  };
  const mockH = { redirect: jest.fn((path) => ({ path })) };

  apiService.getApplicationByPTDNumber.mockResolvedValue({
    error: "not_found",
  });

  const response = await ScanHandlers.postScan(mockRequest, mockH);

  expect(response.path).toBe(
    `/checker/scan/not-found?searchValue=${ptdNumber}`
  );
};

const testValidApplicationRef = async () => {
  const applicationNumber = "ABCD12345";
  const mockRequest = {
    payload: { qrCodeData: applicationNumber },
    yar: { set: jest.fn() },
  };
  const mockH = { redirect: jest.fn((path) => ({ path })) };

  const appData = { applicationNumber, ...mockData };
  apiService.getApplicationByApplicationNumber.mockResolvedValue(appData);

  const response = await ScanHandlers.postScan(mockRequest, mockH);

  expect(response.path).toBe(SEARCH_RESULTS_PATH);
  expect(mockRequest.yar.set).toHaveBeenCalledWith(
    "applicationNumber",
    applicationNumber
  );
};

const testGetAllowCameraPermissions = async () => {
  const mockRequest = { yar: { set: jest.fn() } };
  const mockH = { view: jest.fn((viewPath, data) => ({ viewPath, data })) };

  const response = await ScanHandlers.getAllowCameraPermissions(mockRequest, mockH);

  expect(response.viewPath).toBe(ALLOW_CAMERA_PERMISSIONS);
  expect(response.data).toEqual({
    pageTitle: pageTitle,
  });
};

global.appInsightsClient = {
  trackException: jest.fn()
 };

describe("Scan Handlers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET Endpoints", () => {
    it("should return the scan view and set section", testGetScan);
    it(
      "should return the not found view with correct data",
      testGetScanNotFound
    );
    it(
      "should return the Allow Caera Perissions view",
      testGetAllowCameraPermissions
    );
  });

  describe("POST Endpoints - PTD", () => {
    it("should redirect to search results for valid PTD", testValidPTD);
    it("should handle PTD not found error", testPTDNotFound);
  });

  describe("POST Endpoints - Application Ref", () => {
    it(
      "should redirect to search results for valid Application Ref",
      testValidApplicationRef
    );
    it("should handle Application Ref not found error", async () => {
      const applicationNumber = "ABCD12345";
      const mockRequest = {
        payload: { qrCodeData: applicationNumber },
        yar: { set: jest.fn() },
      };
      const mockH = { redirect: jest.fn((path) => ({ path })) };

      apiService.getApplicationByApplicationNumber.mockResolvedValue({
        error: "not_found",
      });
      const response = await ScanHandlers.postScan(mockRequest, mockH);

      expect(response.path).toBe(
        `/checker/scan/not-found?searchValue=${applicationNumber}`
      );
    });
  });

  describe("Error Cases", () => {
    it("should handle invalid QR code format", async () => {
      const invalidQR = "invalid";
      const mockRequest = { payload: { qrCodeData: invalidQR } };
      const mockH = { redirect: jest.fn((path) => ({ path })) };

      const response = await ScanHandlers.postScan(mockRequest, mockH);
      expect(response.path).toBe(
        `/checker/scan/not-found?searchValue=${invalidQR}`
      );
    });

    it("should handle API errors", async () => {
      const ptdNumber = "GB826ABCD12";
      const mockRequest = { payload: { qrCodeData: ptdNumber } };
      const mockH = { redirect: jest.fn((path) => ({ path })) };

      apiService.getApplicationByPTDNumber.mockRejectedValue(
        new Error("API Error")
      );
      const response = await ScanHandlers.postScan(mockRequest, mockH);

      expect(response.path).toBe(
        `/checker/scan/not-found?searchValue=${ptdNumber}`
      );

      expect(global.appInsightsClient.trackException).toHaveBeenCalled();

    });
  });
});
