import { ScanHandlers } from "../../../../../web/component/checker/scan/handler.js";

describe("Scan Handlers", () => {
  describe("getScan", () => {
    it("should return the scan view", async () => {
      const mockRequest = {};
      const mockH = {
        view: jest.fn((viewPath) => {
          return { viewPath };
        }),
      };

      const response = await ScanHandlers.getScan(mockRequest, mockH);

      expect(response.viewPath).toBe("componentViews/checker/scan/scanView");
      expect(mockH.view).toHaveBeenCalledWith(
        "componentViews/checker/scan/scanView"
      );
    });
  });

  describe("postScan", () => {
    it("should redirect to the dashboard after processing QR code data", async () => {
      const mockRequest = {
        payload: {
          qrCodeData: "test-qr-code-data",
        },
      };
      const mockH = {
        redirect: jest.fn((path) => {
          return { path };
        }),
      };

      const response = await ScanHandlers.postScan(mockRequest, mockH);

      expect(response.path).toBe("/checker/dashboard");
      expect(mockH.redirect).toHaveBeenCalledWith("/checker/dashboard");
    });
  });
});
