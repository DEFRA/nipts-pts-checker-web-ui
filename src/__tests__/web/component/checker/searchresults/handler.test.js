"use strict";

import { SearchResultsHandlers } from "../../../../../web/component/checker/searchresults/handler.js";
import errorMessages from "../../../../../web/component/checker/searchresults/errorMessage.js";
import apiService from "../../../../../api/services/apiService.js";
import {
  validatePassOrFail,
} from "../../../../../web/component/checker/searchresults/validate";
import { CheckOutcomeConstants } from '../../../../../constants/checkOutcomeConstant.js';
import { HttpStatusConstants } from '../../../../../constants/httpMethod.js';

jest.mock("../../../../../api/services/apiService.js");
jest.mock("../../../../../web/component/checker/searchresults/validate");

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
  let request;
  let h;

  beforeEach(() => {
    request = {
      payload: {},
      yar: {
        get: jest.fn(),
        set: jest.fn(),
      },
    };
    h = {
      view: jest.fn(),
      redirect: jest.fn(),
    };

    apiService.recordCheckOutCome.mockClear();
    validatePassOrFail.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a validation error if checklist is invalid & data is invalid', async () => {
    request.payload.checklist = '';
    request.yar.get.mockReturnValueOnce({ documentState: 'active' }); // Mock get call for data
    validatePassOrFail.mockReturnValueOnce({ isValid: false, error: errorMessages.passOrFailOption.empty });

    await SearchResultsHandlers.saveAndContinueHandler(request, h);

    expect(h.view).toHaveBeenCalledWith('componentViews/checker/searchresults/searchResultsView', expect.objectContaining({
      error: errorMessages.passOrFailOption.empty,
      errorSummary: [{ fieldId: 'checklist', message: errorMessages.passOrFailOption.empty }],
      formSubmitted: true,
    }));
  });

  it('should return error if documentstate is revoked', async () => {
    request.payload.checklist = '';
    request.yar.get.mockReturnValueOnce({ documentState: 'revoked' }); // Mock get call for data
    validatePassOrFail.mockReturnValueOnce({ isValid: false, error: errorMessages.passOrFailOption.empty });

    await SearchResultsHandlers.saveAndContinueHandler(request, h);

    expect(h.view).toHaveBeenCalledWith('componentViews/checker/searchresults/searchResultsView', expect.objectContaining({
      error: errorMessages.passOrFailOption.empty,
      errorSummary: [{ fieldId: 'checklist', message: errorMessages.passOrFailOption.empty }],
      formSubmitted: true,
    }));
  });


  it('should return API error if API call fails', async () => {
    request.payload.checklist = 'Pass';
    request.yar.get.mockReturnValueOnce({ documentState: 'active' }).mockReturnValueOnce({ applicationId: 1 }); // Mock get call for data
    validatePassOrFail.mockReturnValueOnce({ isValid: true });
    apiService.recordCheckOutCome.mockResolvedValueOnce({ error: true });

    await SearchResultsHandlers.saveAndContinueHandler(request, h);

    expect(h.view).toHaveBeenCalledWith('componentViews/checker/searchresults/searchResultsView', expect.objectContaining({
      error: 'An error occurred while processing your request',
      errorSummary: [{ fieldId: 'general', message: 'An unexpected error occurred' }],
    }));
  });

  it('should handle unexpected errors', async () => {
    request.payload.checklist = 'Pass';
    request.yar.get.mockReturnValueOnce({ documentState: 'active' });
    validatePassOrFail.mockReturnValueOnce({ isValid: true });
    apiService.recordCheckOutCome.mockRejectedValueOnce(new Error('Unexpected error'));

    await SearchResultsHandlers.saveAndContinueHandler(request, h);

    expect(h.view).toHaveBeenCalledWith('componentViews/checker/searchresults/searchResultsView', {
      error: 'An error occurred while processing your request',
      errorSummary: [{ fieldId: 'general', message: 'An unexpected error occurred' }],
    });
  });
});

});
