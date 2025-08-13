"use strict";
import { UpdateReferralHandler } from "../../../../../web/component/checker/updateReferral/handler.js";
import apiService from "../../../../../api/services/apiService.js";
import {
  validateUpdateReferralForm
} from "../../../../../web/component/checker/updateReferral/validate.js";

const greenTag = "govuk-tag govuk-tag--green";

jest.mock("../../../../../api/services/apiService.js");

jest.mock(
  "../../../../../web/component/checker/updateReferral/validate.js",
  () => ({
    __esModule: true,
    validateUpdateReferralForm: jest.fn(),
  })
);


const sailingTimeSPS = "2024-10-13T17:30:00Z";
const VIEW_PATH =
  "componentViews/checker/updateReferral/updateReferralView";

  const personAllowedToTravel = "Select if the person is allowed or not allowed to travel";
  const enterTheReason = "Enter the reason you selected that outcome";

  describe("getUpdateReferralForm", () => {
    let request, h;
    beforeEach(() => {
      request = {
        yar: {
          get: jest.fn(),
          set: jest.fn(),
        },
      };
      h = {
            view: jest.fn(() => ({ viewRendered: true })),
            redirect: jest.fn(() => ({ redirected: true })),
      };
      jest.clearAllMocks(); // Clear any previous mocks
    });

    it("should format PTD number and return view with application data", async () => {
     // Set up the mock to return a real PTD number
      request.yar.get.mockImplementation((key) => {
        if (key === "identifier") 
          { return "GB12345678901"; }
        return undefined;
      });

      apiService.getApplicationByPTDNumber.mockResolvedValue({
        documentState: "approved",
      });

      const result = await UpdateReferralHandler.getUpdateReferralForm(
        request,
        h
      );

      expect(apiService.getApplicationByPTDNumber).toHaveBeenCalledWith(
        "GB12345678901",
        request
      );

      expect(h.view).toHaveBeenCalledWith(
        VIEW_PATH,
        expect.objectContaining({
          applicationData: expect.objectContaining({
            PTDNumberFormatted: expect.stringMatching(/^GB123\s456\s78901$/),
            documentStatusColourMapping: greenTag,
            status: "Approved",
          }),
        })
      );

      expect(result.viewRendered).toBe(true);
    });
  });

  describe("postUpdateReferralForm", () => {

     let request, h;
      beforeEach(() => {
        request = {
          yar: {
            get: jest.fn(),
            set: jest.fn(),
            clear: jest.fn(),
          },
        };
        h = {
           view: jest.fn(() => ({ viewRendered: true })),
           redirect: jest.fn(() => ({ redirected: true })),
        };
        jest.clearAllMocks(); // Clear any previous mocks    
      });

    it("should return view with errors if validation fails", async () => {
      request.payload = {
        travelUnderFramework: "",
        detailsOfOutcome: "",
        PTDNumberFormatted: "GB123 4567 8901",
        issuedDate: "2025-08-07",
        status: "Approved",
        microchipNumber: "123456789012345",
        petSpecies: "Dog",
        documentStatusColourMapping: greenTag,
      };

      const validationResult = {
        isValid: false,
        errorSummary: [
                 {"fieldId": "outcomeRadio", "message": personAllowedToTravel},
                 {"fieldId": "detailsOfOutcome", "message": enterTheReason}
                ],
        validationResultTextError: enterTheReason,
        validationResultRadioError: personAllowedToTravel,                
      };
      validateUpdateReferralForm.mockReturnValue(validationResult);

      const result = await UpdateReferralHandler.postUpdateReferralForm(
        request,
        h
      );

      expect(h.view).toHaveBeenCalledWith(
        VIEW_PATH,
        expect.objectContaining({
          applicationData: validationResult.applicationData, //expect.any(Object)
          validationResultTextError: enterTheReason,
          validationResultRadioError: personAllowedToTravel,
          formSubmitted: true,
          errorSummary: [{"fieldId": "outcomeRadio", "message": personAllowedToTravel}, {"fieldId": "detailsOfOutcome", "message": enterTheReason}]
        })
      );
      expect(result.viewRendered).toBe(true);
    });

    it("should redirect to dashboard if validation passes", async () => {
      request.payload = {
        travelUnderFramework: "yes",
        detailsOfOutcome: "Valid reason",
        PTDNumberFormatted: "GB123 4567 8901",
        issuedDate: "2025-08-07",
        status: "Approved",
        microchipNumber: "123456789012345",
        petSpecies: "Dog",
        documentStatusColourMapping: greenTag,
        isGBCheck: false,
      };

      request.yar.get.mockImplementation((key) => {
        const mockData = {
          data: {
            applicationId: "testApplicationId",
            documentState: "approved",
            ptdNumber: "GB12345678901",
          },
          IsFailSelected: true,
          currentSailingSlot: {
            departureDate: "2025-08-10",
            sailingHour: "10",
            sailingMinutes: "30",
            selectedRoute: { id: 1 },
            selectedRouteOption: { id: "1" },
          },
          isGBCheck: true,
          routeId: 2,
          routeName: "sps check Route",
          departureDate: "2025-08-10",
          departureTime: "10:30",
          checkSummaryId: "1234567",
          checkerId: "123",
          passengerTypeId: 1,
        };
        return mockData[key] || null;
      });


       validateUpdateReferralForm.mockReturnValue({ isValid: true, error: null });

      apiService.reportNonCompliance.mockResolvedValue({});

      const result = await UpdateReferralHandler.postUpdateReferralForm(request, h);

      expect(request.yar.set).toHaveBeenCalledWith("successConfirmation", true);
      expect(h.redirect).toHaveBeenCalledWith("/checker/dashboard");
      expect(result.redirected).toBe(true);
    });

  });

