import {
  DocumentSearchMainModel
  } from "../../../api/models/documentSearchMainModel.js";;

describe("documentSearchMainModel", () => {
  let response;

  describe("setValues for documentSearchMainModel", () => {
    it("should return correct data", async () => {
      const result = new DocumentSearchMainModel({
        pageHeading: "Test Heading",
        pageTitle: "Test Title",
        ptdSearchText: "Test Search Text",
        errorLabel: "Test Error Label",
        searchText: "Test Search Text"
      });

      expect(result.pageHeading).toEqual("Test Heading");
      expect(result.pageTitle).toEqual("Test Title");
      expect(result.ptdSearchText).toEqual("Test Search Text");
      expect(result.errorLabel).toEqual("Test Error Label");
      expect(result.searchText).toEqual("Test Search Text");
    });
  });

});
