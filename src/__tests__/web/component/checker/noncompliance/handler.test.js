import { NonComplianceHandlers } from "../../../../../web/component/checker/noncompliance/handler.js";
import appSettingsService from "../../../../../api/services/appSettingsService.js";
import apiService from '../../../../../api/services/apiService.js';
import errorMessages from "../../../../../web/component/checker/noncompliance/errorMessages.js";
import { validateNonCompliance } from '../../../../../web/component/checker/noncompliance/validate.js'; // Mock this

const VIEW_PATH = "componentViews/checker/noncompliance/noncomplianceView";
const relevantComments = "Relevant Comments";
//jest.mock("../../../../../api/services/appSettingsService.js");
// Mock the appSettingsService at the top of the test file
jest.mock("../../../../../api/services/appSettingsService", () => ({
  getAppSettings: jest.fn(), // Mock the specific method
}));
jest.mock("../../../../../api/services/apiService.js");
jest.mock('../../../../../web/component/checker/noncompliance/validate.js');

const genericErrorMessage = "The information wasn't recorded, please try to submit again. If you close the application, the information will be lost. You can printscreen or save the information and submit it later.";
const awaitingVerification = "Awaiting verification";
const greenTag = "govuk-tag govuk-tag--green";
const yellowTag = "govuk-tag govuk-tag--yellow";
const orangeTag = "govuk-tag govuk-tag--orange";
const redTag = "govuk-tag govuk-tag--red";
const departureDate = "12/10/2024";
const departuerDateForSPS = "13/10/2024";
const departuerTimeForSPS = "17:30";
const sailingTimeSPS = "2024-10-13T17:30:00Z";


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
    jest.clearAllMocks(); // Clear any previous mocks
  });

  it("should render the view with the correct data", async () => {
    const mockData = { some: "data", documentState: "awaiting" };
    const mockAppSettings = { setting1: "value1" };

    request.yar.get.mockReturnValueOnce(mockData);
    appSettingsService.getAppSettings.mockReturnValue(mockAppSettings);

    const statusMapping = {
      approved: "Approved",
      awaiting: awaitingVerification,
      revoked: "Revoked",
      rejected: "	Unsuccessful",
    };
  
    const statusColourMapping = {
      approved: greenTag,
      awaiting: yellowTag,
      revoked: orangeTag,
      rejected: redTag,
    };
    
    const applicationStatus = mockData.documentState.toLowerCase().trim();
    const documentStatus = statusMapping[applicationStatus] || applicationStatus;
    const documentStatusColourMapping = statusColourMapping[applicationStatus] || applicationStatus;
       
   
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
    appSettingsService.getAppSettings.mockReturnValue({
      someSetting: 'testSetting',
    });

  });

  it("should render errors when validation fails", async () => {
    const mockData = { some: "data", documentState: "awaiting" };
    const applicationStatus = mockData.documentState.toLowerCase().trim();
    const statusMapping = {
      approved: "Approved",
      awaiting: awaitingVerification,
      revoked: "Revoked",
      rejected: "	Unsuccessful",
    };
  
    const statusColourMapping = {
      approved: greenTag,
      awaiting: yellowTag,
      revoked: orangeTag,
      rejected: redTag,
    };
    
    const documentStatus = statusMapping[applicationStatus] || applicationStatus;
    const documentStatusColourMapping = statusColourMapping[applicationStatus] || applicationStatus;
    request.yar.get.mockReturnValueOnce(mockData);

    const payload = {
      mcNotMatch: "true",
      mcNotMatchActual: "invalid_microchip",
      relevantComments: relevantComments,
      passengerTypeId: 1,
      isGBCheck: true,
    };


    const validationResult = {
      isValid: false,
      errors: [{ path: ['microchipNumber'], message: errorMessages.microchipNumber.specialCharacters }],
    };
     validateNonCompliance.mockReturnValue(validationResult);


    request.payload = payload;
    request.payload = payload;
    request.yar.get.mockImplementation((key) => {
      const mockData = {
        data: { "documentState": "awaiting", "some": "data" },
        IsFailSelected: { value: true },  // Return as an object
        currentSailingSlot: {
          departureDate: departureDate,
          sailingHour: "10",
          sailingMinutes: "30",
          selectedRoute: { id: 1 },
          selectedRouteOption: { id: 1 },
        },
        isGBCheck: true,
      };
    
      return mockData[key] || null;
    });
    const mockAppSettings = { setting1: "value1" };
    appSettingsService.getAppSettings.mockResolvedValue(mockAppSettings);

    await NonComplianceHandlers.postNonComplianceHandler(request, h);

    // Since "invalid_microchip" contains letters and special characters, it should return the special characters error message
    expect(h.view).toHaveBeenCalledWith(
      VIEW_PATH,
      expect.objectContaining({
        data: {"documentState": "awaiting", "some": "data"},
        documentStatus,
        documentStatusColourMapping,
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
          departureDate: departureDate,
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

  it("should call reportNonCompliance with the correct data when validation passes and IsFailSelected is true but api call return generic error", async () => {
    const mockedStatusData = { some: "data", documentState: "approved" };
    const applicationStatus = mockedStatusData.documentState.toLowerCase().trim();
    const statusMapping = {
      approved: "Approved",
      awaiting: awaitingVerification,
      revoked: "Revoked",
      rejected: "	Unsuccessful",
    };
  
    const statusColourMapping = {
      approved: greenTag,
      awaiting: yellowTag,
      revoked: orangeTag,
      rejected: redTag,
    };
    
    const documentStatus = statusMapping[applicationStatus] || applicationStatus;
    const documentStatusColourMapping = statusColourMapping[applicationStatus] || applicationStatus;      
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
          departureDate: departureDate,
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
    appSettingsService.getAppSettings.mockReturnValue(mockAppSettings);
    apiService.reportNonCompliance.mockResolvedValue({ error: genericErrorMessage });
  
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

    expect(h.view).toHaveBeenCalledWith(
      VIEW_PATH, {
        //error: errorMessage,
        errorSummary: [
          {
            fieldId: "unexpected",
            message: genericErrorMessage,
            dispalyAs: "text",
          },
        ],
        documentStatus,
        documentStatusColourMapping,
        data: { applicationId: "testApplicationId", documentState: "approved" },
        model: {"setting1": "value1"},
        formSubmitted: true,
        payload,
      }
    );
  });

  it("should call reportNonCompliance with the correct data when validation passes and IsFailSelected is true api call succeeds and isGBCheck", async () => {
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
          departureDate: departureDate,
          sailingHour: "10",
          sailingMinutes: "30",
          selectedRoute: { id: 1 },
          selectedRouteOption: { id: 1 },
        },
        isGBCheck: true,
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

  it("should call reportNonCompliance with the correct data when validation passes and IsFailSelected is true api call succeeds and isSpsCheck", async () => {
    const payload = {
      mcNotMatch: "true",
      mcNotMatchActual: "123456789123456",
      relevantComments: relevantComments,
      spsOutcome: 'true',
      spsOutcomeDetails: "Sps Outcome details",
    };
    validateNonCompliance.mockReturnValue({
      isValid: true,
      errors: [],
    });

    request.payload = payload;
    request.yar.get.mockImplementation((key) => {
      const mockData = {
        data: { applicationId: "testApplicationId", documentState: "approved" },
        IsFailSelected: true,  // Return as an object
        currentSailingSlot: {
          departureDate: departureDate,
          sailingHour: "10",
          sailingMinutes: "30",
          selectedRoute: { id: 1 },
          selectedRouteOption: { id: '1' },
        },
        isGBCheck: false,
        routeId: 2,
        routeName: "sps check Route",
        departureDate: departuerDateForSPS,
        departureTime: departuerTimeForSPS,
        checkSummaryId: "1234567",
        checkerId: "123",
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
        routeId: 2,
        gBCheckId:  "1234567",
        checkerId: "123",
        spsOutcome: true,
        spsOutcomeDetails: "Sps Outcome details",
        sailingOption: '1',
        sailingTime: sailingTimeSPS,          
      }),
      request
    );
  
    expect(request.yar.clear).toHaveBeenCalledWith("routeId");
    expect(request.yar.clear).toHaveBeenCalledWith("routeName");
    expect(request.yar.clear).toHaveBeenCalledWith("departureDate");
    expect(request.yar.clear).toHaveBeenCalledWith("departureTime");
    expect(request.yar.clear).toHaveBeenCalledWith("checkSummaryId");
    expect(request.yar.clear).toHaveBeenCalledWith("IsFailSelected");

    expect(h.redirect).toHaveBeenCalledWith("/checker/dashboard");
  });
});

