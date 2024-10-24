// File: handler.test.js

import { ReferredHandlers } from "../../../../../web/component/checker/referred/handler.js";

const referredView =  "componentViews/checker/referred/referredView";

describe("Handler", () => {
  describe("getDReferred", () => {
    
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return view with currentSailingSlot model when data exists", async () => {
      const mockData = {
        serviceName: "Pet Travel Scheme: Check a pet travelling from Great Britain to Northern Ireland",
      };

      const mockRequest = {
        yar: {
          clear: jest.fn(), // Ensure this is correctly defined
        },
      };

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
        }
      );
    });

    
  });
});
