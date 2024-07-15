"use strict";

import { SearchResultsHandlers } from "../../../../../web/component/checker/searchresults/handler.js";
import errorMessages from "../../../../../web/component/checker/searchresults/errorMessage.js";
import apiService from "../../../../../api/services/apiService.js";
import { CheckOutcomeConstants } from '../../../../../constants/checkOutcomeConstant.js';
import { HttpStatusConstants } from '../../../../../constants/httpMethod.js';

jest.mock("../../../../../api/services/apiService.js");

describe("SearchResultsHandlers", () => {
  describe("getSearchResultsHandler", () => {
    it("should return view with microchipNumber and data from session", async () => {
      const mockMicrochipNumber = "123456789012345";
      const mockData = { some: "data" };

      const request = {
        yar: {
          get: jest.fn((key) => {
            if (key === "microchipNumber") return mockMicrochipNumber;
            if (key === "data") return mockData;
          }),
        },
      };

      const h = {
        view: jest.fn((viewPath, data) => {
          return { viewPath, data };
        }),
      };

      const response =
        await SearchResultsHandlers.getSearchResultsHandler(
          request,
          h
        );

      expect(request.yar.get).toHaveBeenCalledWith("microchipNumber");
      expect(request.yar.get).toHaveBeenCalledWith("data");
      expect(h.view).toHaveBeenCalledWith(
        "componentViews/checker/searchresults/searchResultsView",
        {
          microchipNumber: mockMicrochipNumber,
          pageTitle: "Pet Travel Scheme: Check a pet from Great Britain to Northern Ireland",
          data: mockData,
        }
      );
      expect(response.viewPath).toBe(
        "componentViews/checker/searchresults/searchResultsView"
      );

      expect(response.data).toEqual({
          data: mockData,
          microchipNumber: "123456789012345",
          pageTitle: "Pet Travel Scheme: Check a pet from Great Britain to Northern Ireland",
        });
    });
  });

  describe('saveAndContinueHandler', () => {
    let request, h;
  
    beforeEach(() => {
      request = {
        payload: {
          checklist: 'pass'
        },
        yar: {
          get: jest.fn()
        }
      };
  
      h = {
        response: jest.fn(() => h),
        code: jest.fn(() => h),
        takeover: jest.fn(() => h),
        view: jest.fn(() => h)
      };
  
      request.yar.get.mockImplementation((key) => {
        switch (key) {
          case 'data':
            return {
              applicationId: 'testAppId',
              documentState: 'approved'
            };
          case 'CurrentSailingSlot':
            return {
              sailingHour: '12',
              sailingMinutes: '30',
              selectedRoute: { id: 'route1' }
            };
          default:
            return null;
        }
      });
    });
  
    it('should return success response for passed checklist', async () => {
      apiService.recordCheckOutCome.mockResolvedValue({});
  
      await SearchResultsHandlers.saveAndContinueHandler(request, h);
  
      expect(h.response).toHaveBeenCalledWith({
        status: 'success',
        message: 'Check pass',
        redirectTo: '/checker/document-search',
      });
      expect(h.code).toHaveBeenCalledWith(200);
    });
  
    it('should return success response for failed checklist', async () => {
      request.payload.checklist = 'fail';
      apiService.recordCheckOutCome.mockResolvedValue({});
  
      await SearchResultsHandlers.saveAndContinueHandler(request, h);
  
      expect(h.response).toHaveBeenCalledWith({
        status: 'success',
        message: 'Check fail',
        redirectTo: '/checker/non-compliance',
      });
      expect(h.code).toHaveBeenCalledWith(200);
    });
  
    it('should set checklist to Fail if documentState is rejected or revoked', async () => {
      request.payload.checklist = 'pass';
      request.yar.get.mockImplementation((key) => {
        switch (key) {
          case 'data':
            return {
              applicationId: 'testAppId',
              documentState: 'rejected'
            };
          case 'CurrentSailingSlot':
            return {
              sailingHour: '12',
              sailingMinutes: '30',
              selectedRoute: { id: 'route1' }
            };
          default:
            return null;
        }
      });
      apiService.recordCheckOutCome.mockResolvedValue({});
  
      await SearchResultsHandlers.saveAndContinueHandler(request, h);
  
      expect(apiService.recordCheckOutCome).toHaveBeenCalledWith(expect.objectContaining({
        checkOutcome: CheckOutcomeConstants.Fail
      }));
    });
  
    it('should handle API service error', async () => {
      apiService.recordCheckOutCome.mockResolvedValue({ error: true });
  
      await SearchResultsHandlers.saveAndContinueHandler(request, h);
  
      expect(h.response).toHaveBeenCalledWith({
        status: "fail",
        message: errorMessages.serviceError.message,
        details: [
          { fieldId: "unexpected", message: errorMessages.serviceError.message },
        ],
      });
      expect(h.code).toHaveBeenCalledWith(HttpStatusConstants.BAD_REQUEST);
    });
  
    it('should return view with error message on exception', async () => {
      apiService.recordCheckOutCome.mockImplementation(() => {
        throw new Error('Test error');
      });
  
      await SearchResultsHandlers.saveAndContinueHandler(request, h);
  
      expect(h.view).toHaveBeenCalledWith("componentViews/checker/searchresults/searchResultsView", {
        error: "An error occurred while processing your request",
        errorSummary: [
          { fieldId: "general", message: "An unexpected error occurred" },
        ],
      });
    });
  });
});
