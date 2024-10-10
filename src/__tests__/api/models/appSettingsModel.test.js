import {
  AppSettingsModel
  } from "../../../api/models/appSettingsModel.js";;

describe("appSettingsModel", () => {
 describe("setValues for appSettingsModel", () => {
    it("should return correct data", async () => {
      const result = new AppSettingsModel("Main Title", "Subtitle")

      expect(result.ptsTitle).toEqual("Main Title");
      expect(result.ptsSubTitle).toEqual("Subtitle");
    });
  });

});
