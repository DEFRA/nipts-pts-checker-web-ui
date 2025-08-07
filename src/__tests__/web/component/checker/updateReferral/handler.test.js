"use strict";

jest.mock("../../../../../api/services/apiService.js", () => ({
  __esModule: true,
  default: {
    getApplicationByPTDNumber: jest.fn(),
  },
}));

jest.mock(
  "../../../../../web/component/checker/updateReferral/validate.js",
  () => ({
    __esModule: true,
    validateOutcomeRadio: jest.fn(),
    validateOutcomeReason: jest.fn(),
  })
);

import { UpdateReferralHandler } from "../../../../../web/component/checker/updateReferral/handler.js";
import apiService from "../../../../../api/services/apiService.js";
import {
  validateOutcomeRadio,
  validateOutcomeReason,
} from "../../../../../web/component/checker/updateReferral/validate.js";

const VIEW_PATH =
  "componentViews/checker/updateReferral/updateReferralView";

const setupTest = () => ({
  request: {
    payload: {},
    yar: { get: jest.fn(), set: jest.fn(), clear: jest.fn() },
  },
  h: {
    view: jest.fn(() => ({ viewRendered: true })),
    redirect: jest.fn(() => ({ redirected: true })),
  },
});

describe("UpdateReferralHandler", () => {
  let request, h;

  beforeEach(() => {
    ({ request, h } = setupTest());
    jest.clearAllMocks();
  });

  describe("getUpdateReferralForm", () => {
    test("should format PTD number and return view with application data", async () => {
      request.payload.reference = "GB12345678901";
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
          documentStatusColourMapping: "govuk-tag govuk-tag--green",
          status: "Approved",
        }),
      })
    );

      expect(result.viewRendered).toBe(true);
    });
  });

  describe("postUpdateReferralForm", () => {
    test("should return view with errors if validation fails", async () => {
      request.payload = {
        travelUnderFramework: "",
        detailsOfOutcome: "",
        PTDNumberFormatted: "GB123 4567 8901",
        issuedDate: "2025-08-07",
        status: "Approved",
        microchipNumber: "123456789012345",
        petSpecies: "Dog",
        documentStatusColourMapping: "govuk-tag govuk-tag--green",
      };

      validateOutcomeRadio.mockReturnValue({
        isValid: false,
        error: "Select if the person is allowed or not allowed to travel",
      });

      validateOutcomeReason.mockReturnValue({
        isValid: false,
        error: "Enter the reason you selected that outcome",
      });

      const result = await UpdateReferralHandler.postUpdateReferralForm(
        request,
        h
      );

      expect(h.view).toHaveBeenCalledWith(
        VIEW_PATH,
        expect.objectContaining({
          applicationData: expect.any(Object),
          validationResultTextError: "Enter the reason you selected that outcome",
          validationResultRadioError: "Select if the person is allowed or not allowed to travel",
          formSubmitted: true,
          errorSummary: expect.arrayContaining([
            expect.objectContaining({ fieldId: "outcomeRadio" }),
            expect.objectContaining({ fieldId: "detailsOfOutcome" }),
          ]),
        })
      );
      expect(result.viewRendered).toBe(true);
    });

    test("should redirect to dashboard if validation passes", async () => {
      request.payload = {
        travelUnderFramework: "yes",
        detailsOfOutcome: "Valid reason",
        PTDNumberFormatted: "GB123 4567 8901",
        issuedDate: "2025-08-07",
        status: "Approved",
        microchipNumber: "123456789012345",
        petSpecies: "Dog",
        documentStatusColourMapping: "govuk-tag govuk-tag--green",
      };

      validateOutcomeRadio.mockReturnValue({ isValid: true, error: null });
      validateOutcomeReason.mockReturnValue({ isValid: true, error: null });

      const result = await UpdateReferralHandler.postUpdateReferralForm(
        request,
        h
      );

      expect(request.yar.set).toHaveBeenCalledWith("successConfirmation", true);
      expect(h.redirect).toHaveBeenCalledWith("/checker/dashboard");
      expect(result.redirected).toBe(true);
    });
  });
});
