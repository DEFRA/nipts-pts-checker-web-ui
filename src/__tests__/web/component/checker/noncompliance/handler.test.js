import { NonComplianceHandlers } from "../../../../../web/component/checker/noncompliance/handler.js";
import appSettingsService from "../../../../../api/services/appSettingsService.js";
import errorMessages from "../../../../../web/component/checker/noncompliance/errorMessage.js";

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
      const mockData = { some: "data" };
      const mockAppSettings = { setting1: "value1" };
      request.yar.get.mockReturnValueOnce(mockData);
      appSettingsService.getAppSettings.mockResolvedValue(mockAppSettings);

      await NonComplianceHandlers.getNonComplianceHandler(request, h);

      expect(appSettingsService.getAppSettings).toHaveBeenCalled();
      expect(h.view).toHaveBeenCalledWith(
        "componentViews/checker/noncompliance/noncomplianceView",
        {
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


    it("should set microchip number in session and redirect when validation passes", async () => {
      const payload = {
        microchipNumberRadio: "on",
        microchipNumber: "123456789012345",
        ptdProblem: "someProblem",
      };
      request.payload = payload;

      await NonComplianceHandlers.postNonComplianceHandler(request, h);

      expect(request.yar.set).toHaveBeenCalledWith(
        "reportNoncomplianceMicrochipNumber",
        "123456789012345"
      );
      expect(request.yar.clear).toHaveBeenCalledWith("errors");
      expect(request.yar.clear).toHaveBeenCalledWith("errorSummary");
      expect(request.yar.clear).toHaveBeenCalledWith("payload");
      expect(h.redirect).toHaveBeenCalledWith("/checker/dashboard");
    });
  });
});
