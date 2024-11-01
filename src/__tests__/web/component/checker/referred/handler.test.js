// File: handler.test.js

import { ReferredHandlers } from "../../../../../web/component/checker/referred/handler.js";
import dashboardMainService from "../../../../../api/services/dashboardMainService.js";

jest.mock("../../../../../api/services/currentSailingMainService.js");
jest.mock("../../../../../api/services/dashboardMainService.js", () => ({
  __esModule: true,
  default: {
    getCheckOutcomes: jest.fn(),
  },
}));
jest.mock("../../../../../api/services/spsReferralService.js", () => ({
  __esModule: true,
  default: {
    GetSpsReferrals: jest.fn(),
  },
}));

const referredView =  "componentViews/checker/referred/referredView";

describe("Handler", () => {
  describe("getReferred", () => {
    
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return view with currentSailingSlot model when data exists", async () => {
      const mockData = {
        currentSailingSlot: {
          currentDate: new Date().toLocaleDateString("en-GB"),
          sailingHour: "15",
          sailingMinutes: "15"
        },
        currentDate: new Date().toLocaleDateString("en-GB"),
        serviceName: "Pet Travel Scheme: Check a pet travelling from Great Britain to Northern Ireland",
        check: [{routeName: "Test", departureDate: "31/10/2024", departureTime: "11:10"}],
        spsChecks: []
      };

      const mockRequest = {
        yar: {
          get: jest.fn((key) => {
            if (key === 'currentSailingSlot') {
              return {
                sailingHour: "15",
                sailingMinutes: "15",
              };
            }
            else {
              return null;
            }
          }),
          clear: jest.fn(), // Ensure this is correctly defined
        },
      };
      dashboardMainService.getCheckOutcomes.mockResolvedValue([{routeName: "Test", departureDate: "31/10/2024", departureTime: "11:10"}]);

      const h = {
        view: jest.fn((viewPath) => {
          return { viewPath, mockData };
        }),
      };

      const response = await ReferredHandlers.getReferredChecks(mockRequest, h);

      expect(response.viewPath).toBe(
        referredView
      );
      expect(h.view).toHaveBeenCalledWith(
        referredView,
        {
          serviceName: mockData.serviceName,
          currentSailingSlot: mockData.currentSailingSlot,
          check:  mockData.check,
          spsChecks: mockData.spsChecks,
        }
      );
    });

    
  });
});
