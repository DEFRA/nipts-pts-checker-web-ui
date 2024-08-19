import {
  MicrochipAppPtdMainModel
  } from "../../../api/models/microchipAppPtdMainModel.js";;

describe("microchipAppPtdMainModel", () => {
  let response;

  describe("setValues for microchipAppPtdMainModel", () => {
    it("should return correct data", async () => {

      const result = new MicrochipAppPtdMainModel({
        petId: "715bb304-1ca8-46ba-552d-08dc28c44b63",
        petName: "fido",
        petSpecies: "Dog",
        petBreed: "Bulldog",
        documentState: "awaiting",
        ptdNumber: "SZWPFXEG",
        issuedDate: "09/02/2024", // Formatted date
        microchipNumber: "123456789012345",
        microchipDate: "01/02/2021", // Formatted date
        petSex: "Male",
        petDoB: "01/01/2021", // Formatted date
        petColour: "White, cream or sand",
        petFeaturesDetail: "None",
        applicationId: "ae3d5e79-8821-47ae-5556-08dc295ccb5b",
        travelDocumentId: "e385b94e-5d75-4015-611a-08dc295ccb0b",
      });

      expect(result.petId).toEqual("715bb304-1ca8-46ba-552d-08dc28c44b63");
      expect(result.petName).toEqual("fido");
      expect(result.petSpecies).toEqual("Dog");
      expect(result.petBreed).toEqual("Bulldog");
      expect(result.documentState).toEqual("awaiting");
      expect(result.ptdNumber).toEqual("SZWPFXEG");
      expect(result.issuedDate).toEqual("09/02/2024");
      expect(result.microchipNumber).toEqual("123456789012345");
      expect(result.microchipDate).toEqual("01/02/2021");
      expect(result.petSex).toEqual("Male");
      expect(result.petDoB).toEqual("01/01/2021");
      expect(result.petColour).toEqual("White, cream or sand");
      expect(result.petFeaturesDetail).toEqual("None");
      expect(result.applicationId).toEqual("ae3d5e79-8821-47ae-5556-08dc295ccb5b");
      expect(result.travelDocumentId).toEqual("e385b94e-5d75-4015-611a-08dc295ccb0b");
    });
  });

});
