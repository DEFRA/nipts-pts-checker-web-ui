"use strict";

import { ReferredHandlers } from "../../../../../web/component/checker/referred/handler.js";
import spsReferralMainService from "../../../../../api/services/spsReferralMainService.js";
import headerData from "../../../../../web/helper/constants.js";

jest.mock("../../../../../api/services/spsReferralMainService.js");

const referredView = "componentViews/checker/referred/referredView";

describe("ReferredHandlers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getReferredChecks", () => {
    it("should redirect to /checker/dashboard if session data is missing", async () => {
      const mockRequest = {
        yar: {
          get: jest.fn().mockReturnValue(null), // No routeName, departureDate, or departureTime
        },
      };
      const h = {
        redirect: jest.fn(),
      };

      await ReferredHandlers.getReferredChecks(mockRequest, h);

      expect(h.redirect).toHaveBeenCalledWith("/checker/dashboard");
    });

    it("should return view with spsChecks and pagination when session data exists", async () => {
      const mockSpsChecks = [
        { SPSOutcome: "Check Needed" },
        { SPSOutcome: "Allowed" },
        { SPSOutcome: "Not Allowed" },
      ];

      spsReferralMainService.GetSpsReferrals.mockResolvedValue(mockSpsChecks);

      const mockRequest = {
        yar: {
          get: jest.fn().mockImplementation((key) => {
            if (key === "routeName") return "RouteA";
            if (key === "departureDate") return "01/01/2023";
            if (key === "departureTime") return "12:00";
            if (key === "currentSailingSlot") return { slot: "morning" };
            return null;
          }),
        },
        query: {
          page: 1,
        },
      };

      const h = {
        view: jest.fn(),
      };

      await ReferredHandlers.getReferredChecks(mockRequest, h);

      expect(h.view).toHaveBeenCalledWith(referredView, {
        serviceName: `${headerData.checkerTitle}: ${headerData.checkerSubtitle}`,
        currentSailingSlot: { slot: "morning" },
        check: {
          routeName: "RouteA",
          departureDate: "01/01/2023",
          departureTime: "12:00",
        },
        spsChecks: [
          { SPSOutcome: "Check Needed", classColour: "blue" },
          { SPSOutcome: "Allowed", classColour: "green" },
          { SPSOutcome: "Not Allowed", classColour: "red" },
        ],
        page: 1,
        totalPages: 1,
        pages: [1],
      });
    });

    it("should handle pagination correctly", async () => {
      const mockSpsChecks = new Array(25).fill({ SPSOutcome: "Allowed" });
      spsReferralMainService.GetSpsReferrals.mockResolvedValue(mockSpsChecks);

      const mockRequest = {
        yar: {
          get: jest.fn().mockImplementation((key) => {
            if (key === "routeName") return "RouteB";
            if (key === "departureDate") return "01/01/2023";
            if (key === "departureTime") return "12:00";
            return null;
          }),
        },
        query: {
          page: 2,
        },
      };

      const h = {
        view: jest.fn(),
      };

      await ReferredHandlers.getReferredChecks(mockRequest, h);

      expect(h.view).toHaveBeenCalledWith(expect.any(String), {
        serviceName: `${headerData.checkerTitle}: ${headerData.checkerSubtitle}`,
        currentSailingSlot: {},
        check: {
          routeName: "RouteB",
          departureDate: "01/01/2023",
          departureTime: "12:00",
        },
        spsChecks: mockSpsChecks.slice(10, 20), // Ensuring correct pagination slice
        page: 2,
        totalPages: 3,
        pages: [1, 2, 3],
      });
    });

    it("should assign class colors correctly based on SPSOutcome", async () => {
      const mockSpsChecks = [
        { SPSOutcome: "Check Needed" },
        { SPSOutcome: "Allowed" },
        { SPSOutcome: "Not Allowed" },
      ];
      spsReferralMainService.GetSpsReferrals.mockResolvedValue(mockSpsChecks);

      const mockRequest = {
        yar: {
          get: jest.fn().mockImplementation((key) => {
            if (key === "routeName") return "RouteC";
            if (key === "departureDate") return "01/01/2023";
            if (key === "departureTime") return "12:00";
            return null;
          }),
        },
        query: {},
      };

      const h = {
        view: jest.fn(),
      };

      await ReferredHandlers.getReferredChecks(mockRequest, h);

      expect(h.view).toHaveBeenCalledWith(expect.any(String), {
        serviceName: `${headerData.checkerTitle}: ${headerData.checkerSubtitle}`,
        currentSailingSlot: {},
        check: {
          routeName: "RouteC",
          departureDate: "01/01/2023",
          departureTime: "12:00",
        },
        spsChecks: [
          { SPSOutcome: "Check Needed", classColour: "blue" },
          { SPSOutcome: "Allowed", classColour: "green" },
          { SPSOutcome: "Not Allowed", classColour: "red" },
        ],
        page: 1,
        totalPages: 1,
        pages: [1],
      });
    });
  });

  describe("postCheckReport", () => {
    it("should set CheckSummaryId in request.yar and redirect to /checker/checkreportdetails", async () => {
      // Mock request object
      const request = {
        payload: {
          CheckSummaryId: "12345",
        },
        yar: {
          set: jest.fn(), // Mock the set method
        },
      };
  
      // Mock h object with a redirect method
      const h = {
        redirect: jest.fn().mockReturnValue("redirected"), // Mock redirect method to return a value
      };
  
      const result = await ReferredHandlers.postCheckReport(request, h);
  
      // Assert that request.yar.set was called with the correct arguments
      expect(request.yar.set).toHaveBeenCalledWith(
        "checkSummaryId",
        "12345"
      );
  
      // Assert that h.redirect was called with the correct URL
      expect(h.redirect).toHaveBeenCalledWith("/checker/checkreportdetails");
  
      // Assert that the function returns the correct redirect response
      expect(result).toBe("redirected");
    });
  });

});
