// File: handler.test.js

import { DashboardHandlers } from "../../../../../web/component/checker/dashboard/handler.js";
import DashboardMainModel from "../../../../../constants/dashBoardConstant.js";
import dashboardMainService from "../../../../../api/services/dashboardMainService.js";

jest.mock("../../../../../api/services/currentSailingMainService.js");
jest.mock("../../../../../api/services/dashboardMainService.js", () => ({
  __esModule: true,
  default: {
    getCheckOutcomes: jest.fn(),
    postReferred: jest.fn()
  },
}));

const dashboardView =  "componentViews/checker/dashboard/dashboardView";

describe("Handler", () => {
  describe("getDashboard", () => {
    
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return view with currentSailingSlot model when data exists", async () => {
      const mockData = {
        sailingHour: "15",
        sailingMinutes: "15",
        currentDate: new Date().toLocaleDateString("en-GB"),
        pageTitle: DashboardMainModel.dashboardMainModelData.pageTitle,
      };

      const mockRequest = {
        yar: {
          get: jest.fn((key) => {
            if (key === 'currentSailingSlot') {
              return {
                sailingHour: "15",
                sailingMinutes: "15",
              };
            } else if (key === 'successConfirmation') {
              return true;
            }
            else {
              return null;
            }
          }),
          clear: jest.fn(), // Ensure this is correctly defined
        },
      };
      // Mock the dashboardMainService.getCheckOutcomes to return data
      dashboardMainService.getCheckOutcomes.mockResolvedValue([{}]);

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
          checks: [{}],
          successConfirmation: true
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
          get: jest.fn((key) => {
            if (key === 'currentSailingSlot') {
              return {
                sailingHour: "15",
                sailingMinutes: "15",
              };
            } else if (key === 'successConfirmation') {
              return false;
            }
            else {
              return null;
            }
          }),
          clear: jest.fn(), // Ensure this is correctly defined
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
          successConfirmation: false
        }
      );
    });

    it("should handle exceptions from getCheckOutcomes gracefully", async () => {
      const mockRequest = {
        yar: {
          get: jest.fn().mockReturnValue({}),
          clear: jest.fn(), // Ensure this is correctly defined
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

  describe("postReferred", () => {
    
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should set route details in session and redirect to /checker/referred", async () => {
      const mockRequest = {
        payload: {
          routeId: "12345",
          routeName: "Test Route",
          departureDate: "2025-01-01",
          departureTime: "10:00",
        },
        yar: {
          set: jest.fn(),
        },
      };
  
      const mockResponseToolkit = {
        redirect: jest.fn(),
      };
  
      await DashboardHandlers.postReferred(mockRequest, mockResponseToolkit);
  
      expect(mockRequest.yar.set).toHaveBeenCalledWith("routeId", "12345");
      expect(mockRequest.yar.set).toHaveBeenCalledWith("routeName", "Test Route");
      expect(mockRequest.yar.set).toHaveBeenCalledWith("departureDate", "2025-01-01");
      expect(mockRequest.yar.set).toHaveBeenCalledWith("departureTime", "10:00");
      expect(mockResponseToolkit.redirect).toHaveBeenCalledWith("/checker/referred");
    });
  });
});
