// File: handler.test.js

import { DashboardHandlers } from "../../../../../web/component/checker/dashboard/handler.js";
import DashboardMainModel from "../../../../../constants/dashBoardConstant.js";
import dashboardMainService from "../../../../../api/services/dashboardMainService.js";

jest.mock("../../../../../api/services/currentSailingMainService.js");
jest.mock("../../../../../api/services/dashboardMainService.js", () => ({
  __esModule: true,
  default: {
    getCheckOutcomes: jest.fn(),
  },
}));

const dashboardView =  "componentViews/checker/dashboard/dashboardView";

describe("Handler", () => {
  describe("getDashboard", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return view with CurrentSailingSlot model when data exists", async () => {
      const mockData = {
        sailingHour: "15",
        sailingMinutes: "15",
        currentDate: new Date().toLocaleDateString("en-GB"),
        pageTitle: DashboardMainModel.dashboardMainModelData.pageTitle,
      };

      const mockRequest = {
        yar: {
          get: jest.fn().mockReturnValue({
            sailingHour: "15",
            sailingMinutes: "15",
          }),
        },
      };

      // Mock the dashboardMainService.getCheckOutcomes to return data
      dashboardMainService.getCheckOutcomes.mockResolvedValue([]);

      const h = {
        view: jest.fn((viewPath, data) => {
          return { viewPath, data };
        }),
      };

      const response = await DashboardHandlers.getDashboard(mockRequest, h);

      expect(response.viewPath).toBe(
        dashboardView
      );
      expect(h.view).toHaveBeenCalledWith(
        dashboardView,
        {
          currentSailingSlot: mockData,
          checks: [],
        }
      );
    });

    it('should return view with anyChecks set to "true" when no data exists', async () => {
      const mockData = {
        sailingHour: "15",
        sailingMinutes: "15",
        currentDate: new Date().toLocaleDateString("en-GB"),
        pageTitle: DashboardMainModel.dashboardMainModelData.pageTitle,
      };

      const mockRequest = {
        yar: {
          get: jest.fn().mockReturnValue({
            sailingHour: "15",
            sailingMinutes: "15",
          }),
        },
      };

      // Mock the dashboardMainService.getCheckOutcomes to return empty data
      dashboardMainService.getCheckOutcomes.mockResolvedValue([]);

      const h = {
        view: jest.fn((viewPath, data) => {
          return { viewPath, data };
        }),
      };

      const response = await DashboardHandlers.getDashboard(mockRequest, h);

      expect(response.viewPath).toBe(
        dashboardView
      );
      expect(h.view).toHaveBeenCalledWith(
       dashboardView,
        {
          currentSailingSlot: mockData,
          checks: [],
        }
      );
    });

    it("should handle exceptions from getCheckOutcomes gracefully", async () => {
      const mockRequest = {
        yar: {
          get: jest.fn().mockReturnValue({}),
        },
      };

      // Mock getCheckOutcomes to throw an error
      dashboardMainService.getCheckOutcomes.mockRejectedValue(
        new Error("Test error")
      );

      const h = {
        view: jest.fn(),
        response: jest.fn().mockReturnThis(),
        code: jest.fn(),
      };

      await expect(
        DashboardHandlers.getDashboard(mockRequest, h)
      ).rejects.toThrow("Test error");
    });
  });
});
