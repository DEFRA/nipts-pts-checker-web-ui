import { OrganisationMainModel } from "../../../api/models/organisationMainModel.js";

describe("OrganisationMainModel", () => {
  describe("setValues for OrganisationMainModel", () => {
    it("should return correct data", () => {
      const result = new OrganisationMainModel({
        Id: "9245A7BB-F2A4-4BD7-AD9F-08DC32FA7B20",
        Name: "Golden Retriever, friendly and playful",
        Location: "NI",
        ExternalId: null,
        ActiveFrom: "11/11/2024",
        ActiveTo: null,
        IsActive: true,
      });

      expect(result.Id).toEqual("9245A7BB-F2A4-4BD7-AD9F-08DC32FA7B20");
      expect(result.Name).toEqual(
        "Golden Retriever, friendly and playful"
      );
      expect(result.Location).toEqual("NI");
      expect(result.ExternalId).toEqual(null);
      expect(result.ActiveFrom).toEqual("11/11/2024");
      expect(result.ActiveTo).toEqual(null);
      expect(result.IsActive).toEqual(true);
    });
  });
});
