"use strict";

import { SearchResultsHandlers } from "../../../../../web/component/checker/searchresults/handler.js";
import errorMessages from "../../../../../web/component/checker/searchresults/errorMessages.js";
import apiService from "../../../../../api/services/apiService.js";
import {
  validatePassOrFail,
} from "../../../../../web/component/checker/searchresults/validate";

jest.mock("../../../../../api/services/apiService.js");
jest.mock("../../../../../web/component/checker/searchresults/validate");

const pageTitleDefault = "Pet Travel Scheme: Check a pet travelling from Great Britain to Northern Ireland";
const searchResultsView = "componentViews/checker/searchresults/searchResultsView";
const redirectPath = '/checker/non-compliance';

describe("SearchResultsHandlers", () => {
  let request;
  let h;

  beforeEach(() => {
    request = {
      payload: {},
      yar: {
        get: jest.fn(),
        set: jest.fn(),
        clear: jest.fn(),
      },
    };
    h = {
      view: jest.fn(),
      redirect: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getSearchResultsHandler", () => {
    it("should return view with microchipNumber and data from session", async () => {
      const mockMicrochipNumber = "123456789012345";
      const mockData = { some: "data" };

      request = {
        yar: {
          get: jest.fn((key) => {
            if (key === "microchipNumber") {
              return mockMicrochipNumber;
            }
            if (key === "data") {
              return mockData;
            }
          }),
        },
      };

      h = {
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
        searchResultsView,
        {
          microchipNumber: mockMicrochipNumber,
          pageTitle: pageTitleDefault,
          data: mockData,
          checklist: {},
        }
      );
      expect(response.viewPath).toBe(
        searchResultsView
      );

      expect(response.data).toEqual({
          data: mockData,
          microchipNumber: "123456789012345",
          pageTitle: pageTitleDefault,
          checklist: {},
        });
    });

    it("should return view with microchipNumber data and nonComplianceToSearchResults navigation from session", async () => {
      const mockMicrochipNumber = "123456789012345";
      const mockData = { some: "data" };
      const nonComplianceToSearchResults = true;
      const fail = 'Fail';

      request = {
        yar: {
          get: jest.fn((key) => {
            const mockValues = {
              microchipNumber: mockMicrochipNumber,
              data: mockData,
              nonComplianceToSearchResults: nonComplianceToSearchResults,
            };
            return mockValues[key] || null; // Default return value is `null`
          }),
          clear: jest.fn(), // Ensure `clear` is included here
        },
      };

      h = {
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
      expect(request.yar.get).toHaveBeenCalledWith("nonComplianceToSearchResults");
      expect(h.view).toHaveBeenCalledWith(
        searchResultsView,
        {
          microchipNumber: mockMicrochipNumber,
          pageTitle: pageTitleDefault,
          data: mockData,
          checklist: fail,
        }
      );
      expect(response.viewPath).toBe(
        searchResultsView
      );

      expect(response.data).toEqual({
          data: mockData,
          microchipNumber: "123456789012345",
          pageTitle: pageTitleDefault,
		      checklist: fail,
        });

        expect(request.yar.clear).toHaveBeenCalledWith("nonComplianceToSearchResults");
    });
  });


  describe('saveAndContinueHandler', () => {
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

it("should return a validation error if checklist is invalid & data is invalid", async () => {
  request.payload.checklist = "";
  const mockData = { documentState: "active", ptdNumber: "GB8262C39F9" };
  request.yar.get.mockImplementation((key) => {
    if (key === "data") return mockData;
    return null;
  });
  validatePassOrFail.mockReturnValueOnce({
    isValid: false,
    error: errorMessages.passOrFailOption.empty,
  });

  await SearchResultsHandlers.saveAndContinueHandler(request, h);

  expect(h.view).toHaveBeenCalledWith(
    searchResultsView,
    expect.objectContaining({
      error: errorMessages.passOrFailOption.empty,
      errorSummary: [
        { fieldId: "checklist", message: errorMessages.passOrFailOption.empty },
      ],
      formSubmitted: true,
      data: expect.objectContaining({
        ptdFormatted: expect.any(String),
      }),
    })
  );
});

it("should return error if documentstate is revoked", async () => {
  request.payload.checklist = "";
  const mockData = { documentState: "revoked", ptdNumber: "GB8262C39F9" };
  request.yar.get.mockImplementation((key) => {
    if (key === "data") return mockData;
    return null;
  });
  validatePassOrFail.mockReturnValueOnce({
    isValid: false,
    error: errorMessages.passOrFailOption.empty,
  });

  await SearchResultsHandlers.saveAndContinueHandler(request, h);

  expect(h.view).toHaveBeenCalledWith(
    searchResultsView,
    expect.objectContaining({
      error: errorMessages.passOrFailOption.empty,
      errorSummary: [
        { fieldId: "checklist", message: errorMessages.passOrFailOption.empty },
      ],
      formSubmitted: true,
      data: expect.objectContaining({
        ptdFormatted: expect.any(String),
      }),
    })
  );
});

    it('should return to document search if checks pass', async () => {
      request.payload.checklist = 'Pass';
      request.payload.microchipNumber = "123456789012345";
    
      request.yar.get
                  .mockReturnValueOnce({ documentState: 'active' })
                  .mockReturnValueOnce({
                    departureDate: '12/10/2023', // Format: DD/MM/YYYY
                    sailingHour: '14',
                    sailingMinutes: '30',
                    selectedRoute: { id: 'route123' },
                    selectedRouteOption: { id: 'option456' },
                    routeFlight: 'FL1234',                  
                  })
                  .mockReturnValueOnce({ IsFailSelected: true });

      request.yar.clear = jest.fn();

      apiService.recordCheckOutCome.mockResolvedValueOnce({
        status: 'success', // You can set the status or result to whatever your function expects
      });
                  
      validatePassOrFail.mockReturnValueOnce({ isValid: true });

      await SearchResultsHandlers.saveAndContinueHandler(request, h);

      expect(h.redirect).toHaveBeenCalledWith('/checker/dashboard');
    });

    it('should return to non compliance if checks fail', async () => {
      request.payload.checklist = 'Fail';
      request.payload.microchipNumber = "123456789012345"
      request.yar.get.mockReturnValueOnce({ documentState: 'active' });
      validatePassOrFail.mockReturnValueOnce({ isValid: true });

      await SearchResultsHandlers.saveAndContinueHandler(request, h);

      expect(h.redirect).toHaveBeenCalledWith(redirectPath);
    });

    it('should return to non compliance if documentState Rejected', async () => {
      request.payload.checklist = 'Fail';
      request.payload.microchipNumber = "123456789012345"
      request.yar.get.mockReturnValueOnce({ documentState: 'rejected' });
      validatePassOrFail.mockReturnValueOnce({ isValid: true });

      await SearchResultsHandlers.saveAndContinueHandler(request, h);

      expect(h.redirect).toHaveBeenCalledWith(redirectPath);
      expect(request.payload.checklist).toEqual('Fail');
    });


    it('should return to non compliance if documentState awaiting', async () => {
      request.payload.checklist = 'Fail';
      request.payload.microchipNumber = "123456789012345"
      request.yar.get.mockReturnValueOnce({ documentState: 'awaiting' });
      validatePassOrFail.mockReturnValueOnce({ isValid: true });

      await SearchResultsHandlers.saveAndContinueHandler(request, h);

      expect(h.redirect).toHaveBeenCalledWith(redirectPath);
      expect(request.payload.checklist).toEqual('Fail');
    });

    it('should handle unexpected errors', async () => {
      request.payload.checklist = 'Pass';
      request.yar.get.mockReturnValueOnce({ documentState: 'active' });
      validatePassOrFail.mockReturnValueOnce({ isValid: true });
      apiService.recordCheckOutCome.mockRejectedValueOnce(new Error('Unexpected error'));

      await SearchResultsHandlers.saveAndContinueHandler(request, h);

      expect(h.view).toHaveBeenCalledWith(searchResultsView, {
        error: 'An error occurred while processing your request',
        errorSummary: [{ fieldId: 'general', message: 'An unexpected error occurred' }],
      });
    });

  });

});
