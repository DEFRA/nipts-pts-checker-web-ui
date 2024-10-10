import { NonComplianceHandlers } from "../../../../../web/component/checker/noncompliance/handler.js";
import appSettingsService from "../../../../../api/services/appSettingsService.js";
import errorMessages from "../../../../../web/component/checker/noncompliance/errorMessages.js";

jest.mock("../../../../../api/services/appSettingsService.js");

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
        "componentViews/checker/noncompliance/noncomplianceView",
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
        view: jest.fn(),
        redirect: jest.fn(),
      };
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
      request.payload = payload;
      const mockAppSettings = { setting1: "value1" };
      appSettingsService.getAppSettings.mockResolvedValue(mockAppSettings);

      await NonComplianceHandlers.postNonComplianceHandler(request, h);

      // Since "invalid_microchip" contains letters and special characters, it should return the special characters error message
      expect(h.view).toHaveBeenCalledWith(
        "componentViews/checker/noncompliance/noncomplianceView",
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




  });
});
