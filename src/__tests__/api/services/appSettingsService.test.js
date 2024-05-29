import appSettingsService from "../../../api/services/appSettingsService.js";
import { AppSettingsModel } from "../../../api/models/appSettingsModel.js";

describe("appSettingsService", () => {
  describe("getAppSettings() function", () => {
    it("should return AppSettingsModel instance", () => {
      const expected = new AppSettingsModel(
        "Pet Travel Scheme",
        "Check a pet from Great Britain to Northern Ireland"
      );

      const result = appSettingsService.getAppSettings();

      expect(result).toEqual(expected);
    });
  });
});
