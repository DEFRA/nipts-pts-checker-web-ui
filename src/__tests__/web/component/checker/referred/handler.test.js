"use strict";

import { ReferredHandlers } from "../../../../../web/component/checker/referred/handler.js";
import spsReferralMainService from "../../../../../api/services/spsReferralMainService.js";
import headerData from "../../../../../web/helper/constants.js";

jest.mock("../../../../../api/services/spsReferralMainService.js");

const referredView = "componentViews/checker/referred/referredView";
const checkNeeded = "Check Needed";
const notAllowed = "Not Allowed";
const allowed = "Allowed";
const invalidSpsOutcome = "not a valid spsOutcome";
const ptdNum = "GB826223445";
const ptdFormatted = "GB826 223 445";
const numArrayElements = 25;
const departureDate = "01/01/2023";
const paginationMin = 10;
const paginationMax = 20;
const totalPages = 3;

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

    it("should redirect to /checker/referred when there are no sps checks", async () => {
      const mockSpsChecks = [];

      spsReferralMainService.getSpsReferrals.mockResolvedValue(mockSpsChecks);

      const mockRequest = {
        yar: {
          get: jest.fn().mockImplementation((key) => {
            if (key === "routeName") {
              return "RouteB";
            }
            if (key === "departureDate") {
              return departureDate;
            } 
            if (key === "departureTime") {
              return "12:00";
            }
            return null;
          }),
        },
      };
      const h = {
        redirect: jest.fn(),
      };

      await ReferredHandlers.getReferredChecks(mockRequest, h);

      expect(h.redirect).toHaveBeenCalledWith("/checker/referred");
    });

    it("should return view with spsChecks and pagination when session data exists", async () => {
      const mockSpsChecks = [
        { SPSOutcome: checkNeeded, PTDNumber: ptdNum, PTDNumberFormatted: ptdFormatted },
        { SPSOutcome: allowed, PTDNumber: ptdNum, PTDNumberFormatted: ptdFormatted },
        { SPSOutcome: notAllowed, PTDNumber: ptdNum, PTDNumberFormatted: ptdFormatted },
      ];

      spsReferralMainService.getSpsReferrals.mockResolvedValue(mockSpsChecks);
      
      const mockRequest = {
        yar: {
          get: jest.fn().mockImplementation((key) => {
            if (key === "routeName") {
              return "RouteA";
            }
            if (key === "departureDate") 
            {
              return departureDate
            }
            if (key === "departureTime") {
              return "12:00";
            }
            if (key === "currentSailingSlot") {
              return { slot: "morning" };
            }
            if (key === "spsChecks") {
              return {
                spsChecks: [
                  { SPSOutcome: checkNeeded, classColour: "blue", PTDNumber: ptdNum, PTDNumberFormatted: ptdFormatted },
                  { SPSOutcome: allowed, classColour: "green", PTDNumber: ptdNum, PTDNumberFormatted: ptdFormatted },
                  { SPSOutcome: notAllowed, classColour: "red", PTDNumber: ptdNum, PTDNumberFormatted: ptdFormatted },
                ],
              };
            }            
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
          departureDate: departureDate,
          departureTime: "12:00",
        },
        spsChecks: [
          { SPSOutcome: checkNeeded, classColour: "blue", PTDNumber: ptdNum, PTDNumberFormatted: ptdFormatted },
          { SPSOutcome: allowed, classColour: "green", PTDNumber: ptdNum, PTDNumberFormatted: ptdFormatted },
          { SPSOutcome: notAllowed, classColour: "red", PTDNumber: ptdNum, PTDNumberFormatted: ptdFormatted },
        ],
        page: 1,
        totalPages: 1,
        pages: [1],
      });
    });

    it("should handle pagination correctly when exceeding the max length", async () => {

      const mockSpsChecks = Array.from({ length: numArrayElements }, () => ({
        SPSOutcome: allowed,
        PTDNumber: ptdNum,
        PTDNumberFormatted: ptdFormatted
      }));

      spsReferralMainService.getSpsReferrals.mockResolvedValue(mockSpsChecks);

      const mockRequest = {
        yar: {
          get: jest.fn().mockImplementation((key) => {
            if (key === "routeName") {
              return "RouteB";
            }
            if (key === "departureDate") {
              return departureDate;
            } 
            if (key === "departureTime") {
              return "12:00";
            }
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
          departureDate: departureDate,
          departureTime: "12:00",
        },
        spsChecks: mockSpsChecks.slice(paginationMin, paginationMax), // Ensuring correct pagination slice
        page: 2,
        totalPages: totalPages,
        pages: [1, 2, 3],
      });
    });

    it("should assign class colors correctly based on SPSOutcome", async () => {
      const mockSpsChecks = [
        { SPSOutcome: checkNeeded, PTDNumber: ptdNum, PTDNumberFormatted: ptdFormatted },
        { SPSOutcome: allowed, PTDNumber: ptdNum, PTDNumberFormatted: ptdFormatted },
        { SPSOutcome: notAllowed, PTDNumber: ptdNum, PTDNumberFormatted: ptdFormatted },
      ];
      spsReferralMainService.getSpsReferrals.mockResolvedValue(mockSpsChecks);

      const mockRequest = {
        yar: {
          get: jest.fn().mockImplementation((key) => {
            if (key === "routeName") {
                return "RouteC";
            }
            if (key === "departureDate") {
              return departureDate;
            }
            if (key === "departureTime") {
              return "12:00";
            }
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
          departureDate: departureDate,
          departureTime: "12:00",
        },
        spsChecks: [
          { SPSOutcome: checkNeeded, classColour: "blue", PTDNumber: ptdNum, PTDNumberFormatted: ptdFormatted },
          { SPSOutcome: allowed, classColour: "green", PTDNumber: ptdNum, PTDNumberFormatted: ptdFormatted },
          { SPSOutcome: notAllowed, classColour: "red", PTDNumber: ptdNum, PTDNumberFormatted: ptdFormatted },
        ],
        page: 1,
        totalPages: 1,
        pages: [1],
      });
    });

    it("should not format a PTD number that doesn't start with GB", async () => {
      const notGBPTDNum = "NOTGB1234";

      const mockSpsChecks = [
        { SPSOutcome: checkNeeded, PTDNumber: notGBPTDNum},
      ];
      spsReferralMainService.getSpsReferrals.mockResolvedValue(mockSpsChecks);

      const mockRequest = {
        yar: {
          get: jest.fn().mockImplementation((key) => {
            if (key === "routeName") {
                return "RouteC";
            }
            if (key === "departureDate") {
              return departureDate;
            }
            if (key === "departureTime") {
              return "12:00";
            }
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
          departureDate: departureDate,
          departureTime: "12:00",
        },
        spsChecks: [
          { SPSOutcome: checkNeeded, classColour: "blue", PTDNumber: notGBPTDNum, },
        ],
        page: 1,
        totalPages: 1,
        pages: [1],
      });
    });
  });

  it("should return view with one spsCheck that has no itemClass due to not having a valid spsOutcome status", async () => {
      const mockSpsChecks = [
        { SPSOutcome: invalidSpsOutcome, PTDNumber: ptdNum, PTDNumberFormatted: ptdFormatted },
      ];

      spsReferralMainService.getSpsReferrals.mockResolvedValue(mockSpsChecks);
      
      const mockRequest = {
        yar: {
          get: jest.fn().mockImplementation((key) => {
            if (key === "routeName") {
              return "RouteA";
            }
            if (key === "departureDate") 
            {
              return departureDate
            }
            if (key === "departureTime") {
              return "12:00";
            }
            if (key === "currentSailingSlot") {
              return { slot: "morning" };
            }
            if (key === "spsChecks") {
              return {
                spsChecks: [
                  { SPSOutcome: invalidSpsOutcome, PTDNumber: ptdNum, PTDNumberFormatted: ptdFormatted },
                ],
              };
            }            
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
          departureDate: departureDate,
          departureTime: "12:00",
        },
        spsChecks: [
          { SPSOutcome: invalidSpsOutcome, PTDNumber: ptdNum, PTDNumberFormatted: ptdFormatted },
        ],
        page: 1,
        totalPages: 1,
        pages: [1],
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

     it("should set identifier in request.yar when PTDNumber given in payload", async () => {
      // Mock request object
      const request = {
        payload: {
          PTDNumber: "123456",
        },
        yar: {
          set: jest.fn(), // Mock the set method
        },
      };
  
      // Mock h object with a redirect method
      const h = {
        redirect: jest.fn().mockReturnValue("redirected"), // Mock redirect method to return a value
      };
  
      await ReferredHandlers.postCheckReport(request, h);
  
      // Assert that request.yar.set was called with the correct arguments
      expect(request.yar.set).toHaveBeenCalledWith(
        "identifier",
        "123456"
      );
    });

    it("should set identifier in request.yar when ApplicationNumber given in payload", async () => {
      // Mock request object
      const request = {
        payload: {
          ApplicationNumber: "1234567890",
        },
        yar: {
          set: jest.fn(), // Mock the set method
        },
      };
  
      // Mock h object with a redirect method
      const h = {
        redirect: jest.fn().mockReturnValue("redirected"), // Mock redirect method to return a value
      };
  
      await ReferredHandlers.postCheckReport(request, h);
  
      // Assert that request.yar.set was called with the correct arguments
      expect(request.yar.set).toHaveBeenCalledWith(
        "identifier",
        "1234567890"
      );
    });


  });

});
