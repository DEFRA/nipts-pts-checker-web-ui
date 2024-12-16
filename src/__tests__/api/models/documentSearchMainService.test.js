import {
  DocumentSearchMainModel
  } from "../../../api/models/documentSearchMainModel.js";


  const serachText = "Test Search Text";
  const pageHeading = "Test Heading";
  const pageTitle = "Test Title";
  const errorLabel = "Test Error Label";

describe("documentSearchMainModel", () => {
 describe("setValues for documentSearchMainModel", () => {
    it("should return correct data", async () => {
      const result = new DocumentSearchMainModel({
        pageHeading: pageHeading,
        pageTitle: pageTitle,
        ptdSearchText: serachText,
        errorLabel: errorLabel,
        searchText: serachText
      });

      expect(result.pageHeading).toEqual(pageHeading);
      expect(result.pageTitle).toEqual(pageTitle);
      expect(result.ptdSearchText).toEqual(serachText);
      expect(result.errorLabel).toEqual(errorLabel);
      expect(result.searchText).toEqual(serachText);
    });
  });
});
