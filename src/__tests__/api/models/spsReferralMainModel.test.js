import { SpsReferralMainModel } from "../../../api/models/spsReferralMainModel.js";

describe("SpsReferralMainModel", () => {
  describe("setValues for SpsReferralMainModel", () => {
    it("should return correct data", () => {
      const result = new SpsReferralMainModel({
        PTDNumber: "XYZ123",
        PetDescription: "Golden Retriever, friendly and playful",
        Microchip: "987654321012345",
        TravelBy: "Car",
        SPSOutcome: "Approved",
        classColour: "Green",
        CheckSummaryId: "9245A7BB-F2A4-4BD7-AD9F-08DC32FA7B20"
      });

      expect(result.PTDNumber).toEqual("XYZ123");
      expect(result.PetDescription).toEqual(
        "Golden Retriever, friendly and playful"
      );
      expect(result.Microchip).toEqual("987654321012345");
      expect(result.TravelBy).toEqual("Car");
      expect(result.SPSOutcome).toEqual("Approved");
      expect(result.classColour).toEqual("Green");
      expect(result.CheckSummaryId).toEqual("9245A7BB-F2A4-4BD7-AD9F-08DC32FA7B20");
    });
  });
});
