import {
    SPSReferralModel
    } from "../../../api/models/spsReferralModel.js";;
  
  describe("spsReferralModel", () => {
   describe("setValues for spsReferralModel", () => {
      it("should return correct data", async () => {
        const result = new SPSReferralModel({
            PTDNumber: "GB826111111",
            PetDescription: "Test Pet Description",
            Microchip: "123456789012345",
            TravelBy: "Test",
            SPSOutcome: "Test",
            classColour: "Test"
        });
  
        expect(result.PTDNumber).toEqual("GB826111111");
        expect(result.PetDescription).toEqual("Test Pet Description");
        expect(result.Microchip).toEqual("123456789012345");
        expect(result.TravelBy).toEqual("Test");
        expect(result.SPSOutcome).toEqual("Test");
        expect(result.classColour).toEqual("Test");
      });
    });
  
  });
  