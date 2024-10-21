import { NonComplianceHandlers } from "../../../../../web/component/checker/noncompliance/handler.js";
import appSettingsService from "../../../../../api/services/appSettingsService.js";
import apiService from '../../../../../api/services/apiService.js';
import errorMessages from "../../../../../web/component/checker/noncompliance/errorMessages.js";
import { validateNonCompliance } from '../../../../../web/component/checker/noncompliance/validate.js'; // Mock this

const VIEW_PATH = "componentViews/checker/noncompliance/noncomplianceView";
const relevantComments = "Relevant Comments";
jest.mock("../../../../../api/services/appSettingsService.js");
jest.mock("../../../../../api/services/apiService.js");
jest.mock('../../../../../web/component/checker/noncompliance/validate.js');

describe("NonComplianceHandlers", () => {
  describe("getNonComplianceHandler", () => {
    let request, h;

    beforeEach(() => {
      request = {
        yar: {
          get: jest.fn(),
        },
      };
      h = {
        view: jest.fn(),
      };
    });

    it("should render the view with the correct data", async () => {
      const mockData = { some: "data", documentState: "awaiting" };
      const applicationStatus = mockData.documentState.toLowerCase().trim();

      const statusMapping = {
        approved: "Approved",
        awaiting: "Awaiting Verification",
        revoked: "Revoked",
        rejected: "	Unsuccessful",
      };
    
      const statusColourMapping = {
        approved: "govuk-tag govuk-tag--green",
        awaiting: "govuk-tag govuk-tag--yellow",
        revoked: "govuk-tag govuk-tag--orange",
        rejected: "govuk-tag govuk-tag--red",
      };
      
      const documentStatus = statusMapping[applicationStatus] || applicationStatus;
      const documentStatusColourMapping = statusColourMapping[applicationStatus] || applicationStatus;
      const mockAppSettings = { setting1: "value1" };
      request.yar.get.mockReturnValueOnce(mockData);
      appSettingsService.getAppSettings.mockResolvedValue(mockAppSettings);

      await NonComplianceHandlers.getNonComplianceHandler(request, h);

      expect(appSettingsService.getAppSettings).toHaveBeenCalled();
      expect(h.view).toHaveBeenCalledWith(
        VIEW_PATH,
        {
          documentStatus: documentStatus,
          documentStatusColourMapping: documentStatusColourMapping,
          data: mockData,
          model: mockAppSettings,
          errors: {},
          errorSummary: [],
          formSubmitted: false,
          payload: {},
        }
      );
    });
  });

  describe("postNonComplianceHandler", () => {
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
        view: jest.fn().mockReturnValue('view response'),
        redirect: jest.fn().mockReturnValue('redirect response'),
      };

      // Mock the appSettingsService response
      appSettingsService.getAppSettings.mockResolvedValue({
        someSetting: 'testSetting',
      });
    });

    it("should render errors when validation fails", async () => {
      const payload = {
        microchipNumberRadio: "on",
        microchipNumber: "invalid_microchip",
        ptdProblem: "someProblem",
        passengerType: "foot",
        outcomeReferred: "",
        outcomeAdvised: "",
        outcomeNotTravelling: "",
        outcomeSPS: "",
        moreDetail: ""
      };

      const validationResult = {
        isValid: false,
        errors: [{ path: ['microchipNumber'], message: errorMessages.microchipNumber.specialCharacters }],
      };
       validateNonCompliance.mockReturnValue(validationResult);


      request.payload = payload;
      const mockAppSettings = { setting1: "value1" };
      appSettingsService.getAppSettings.mockResolvedValue(mockAppSettings);

      await NonComplianceHandlers.postNonComplianceHandler(request, h);

      // Since "invalid_microchip" contains letters and special characters, it should return the special characters error message
      expect(h.view).toHaveBeenCalledWith(
        VIEW_PATH,
        expect.objectContaining({
          errors: {
            microchipNumber: errorMessages.microchipNumber.specialCharacters, // Adjusted to specialCharacters
          },
          errorSummary: [
            {
              fieldId: "microchipNumber",
              message: errorMessages.microchipNumber.specialCharacters, // Adjusted to specialCharacters
            },
          ],
          formSubmitted: true,
          payload,
        })
      );
    });

    it("should render no errors when validation passes", async () => {
      const payload = {
        microchipNumberRadio: "on",
        microchipNumber: "123456789012345",
        ptdProblem: "",
        passengerType: "foot",
        outcomeReferred: "",
        outcomeAdvised: "",
        outcomeNotTravelling: "",
        outcomeSPS: "",
        moreDetail: "", 
        visualCheckProblem: "on",
        otherIssuesCommercialRadio: "on",
        otherIssuesAuthorisedRadio: "on",
        otherIssuesSomethingRadio: "on",
        relevantComments: "Test Comments"
      };
      request.payload = payload;

      validateNonCompliance.mockReturnValue({
        isValid: true,
        errors: [],
      });

      const mockAppSettings = { setting1: "value1" };
      appSettingsService.getAppSettings.mockResolvedValue(mockAppSettings);

      await NonComplianceHandlers.postNonComplianceHandler(request, h);

      expect(h.redirect).toHaveBeenCalledWith(
        "/checker/dashboard"
      );
    });

    it('should render view with errors when validation fails', async () => {

      const payload = {
        "applicationId": "1DD1942C-1606-45F8-111A-08DCDD61D7DE",
        "checkOutcome": "Fail",
        "checkerId": "E52D08BF-AF96-4040-B154-5BA38450590B",
        "routeId": 1,
        "sailingTime": "2024-10-14T17:17:00Z",
        "sailingOption": 1,
        "flightNumber": "AB3456",
        "isGBCheck": true,
        "mcNotFound": true,
        "mcNotMatch": null,
        "mcNotMatchActual": "123456789123456",
        "vcNotMatchPTD": true,
        "oiFailPotentialCommercial": true,
        "oiFailAuthTravellerNoConfirmation": true,
        "oiFailOther": true,
        "passengerTypeId": 1,
        "relevantComments": relevantComments,
        "gbRefersToDAERAOrSPS": true,
        "gbAdviseNoTravel": true,
        "gbPassengerSaysNoTravel": true,
        "spsOutcome": true,
        "spsOutcomeDetails": "SPS Outcome Details"
      };
      request.payload = payload;
      request.yar.get.mockImplementation((key) => {
        const mockData = {
          data: { applicationId: "testApplicationId", documentState: "approved" },
          IsFailSelected: { value: true },  // Return as an object
          currentSailingSlot: {
            departureDate: "12/10/2024",
            sailingHour: "10",
            sailingMinutes: "30",
            selectedRoute: { id: 1 },
            selectedRouteOption: { id: 1 },
          }
        };
      
        return mockData[key] || null;
      });

      const passengerTypeErrorMessage = "Select a type of passenger";

      // Mock the validation result as failed
      const validationResult = {
        isValid: false,
        errors: [{ path: ['passengerType'], message: passengerTypeErrorMessage }],
      };
       validateNonCompliance.mockReturnValue(validationResult);
  
      // Execute the handler
      const result = await NonComplianceHandlers.postNonComplianceHandler(request, h);
  
      // Assertions
      expect(h.view).toHaveBeenCalledWith(
        VIEW_PATH,
        expect.objectContaining({
          data: {"applicationId": "testApplicationId", "documentState": "approved"},
          errors: { passengerType: passengerTypeErrorMessage },
          errorSummary: [{ fieldId: 'passengerType', message: passengerTypeErrorMessage }],
          formSubmitted: true,
          model: {"someSetting": "testSetting"}, 
          payload: request.payload,
        })
      );
      expect(result).toBe('view response');
    });

    it("should call reportNonCompliance with the correct data when validation passes and IsFailSelected is true", async () => {
      const payload = {
        mcNotMatch: "true",
        mcNotMatchActual: "123456789123456",
        relevantComments: relevantComments,
      };
      validateNonCompliance.mockReturnValue({
        isValid: true,
        errors: [],
      });

      request.payload = payload;
      request.yar.get.mockImplementation((key) => {
        const mockData = {
          data: { applicationId: "testApplicationId", documentState: "approved" },
          IsFailSelected: { value: true },  // Return as an object
          currentSailingSlot: {
            departureDate: "12/10/2024",
            sailingHour: "10",
            sailingMinutes: "30",
            selectedRoute: { id: 1 },
            selectedRouteOption: { id: 1 },
          }
        };
      
        return mockData[key] || null;
      });
    
      validateNonCompliance.mockReturnValue({
        isValid: true,
        errors: [],
      });
    
      const mockAppSettings = { setting1: "value1" };
      appSettingsService.getAppSettings.mockResolvedValue(mockAppSettings);
      apiService.reportNonCompliance.mockResolvedValue({});
    
      await NonComplianceHandlers.postNonComplianceHandler(request, h);
    
      expect(apiService.reportNonCompliance).toHaveBeenCalledWith(
        expect.objectContaining({
          applicationId: "testApplicationId",
          checkOutcome: "Fail",
          mcNotMatchActual: "123456789123456",
          relevantComments: relevantComments,
        }),
        request
      );
    
      expect(h.redirect).toHaveBeenCalledWith("/checker/dashboard");
    });
    
  });
});
