import SPSReferralService from "../../../api/services/spsReferralService";
import { SPSReferralModel } from "../../../api/models/spsReferralModel";
import httpService from "../../../api/services/httpService";

jest.mock("../../../api/services/httpService");


describe("getReferralData", () => {
    let request;
  
    beforeEach(() => {
      request = {
        // Mock request object
        headers: {
          authorization: "Bearer mockToken",
        },
      };
      jest.clearAllMocks();
    });
  
    it("should fetch referralData", async () => {
        const route = "";
        const sailingDate = "2024-10-31T11:10:00.000Z"
      const apiResponse = {
        data: 
            [{
                ptdNumber: "GB826111111",
                petDescription: "test",
                microchip: "123456789012345",
                travelBy: "test",
                spsOutcome: "Check Needed"
            }]
      };
  
      httpService.postAsync.mockResolvedValue(apiResponse);
  
      const expectedData = new SPSReferralModel({
       PTDNumber: "GB826111111",
       PetDescription: "test",
       Microchip: "123456789012345",
       TravelBy: "test",
       SPSOutcome: "Check Needed"
      });
  
      const data = await SPSReferralService.GetSPSReferrals(route, sailingDate, request);
  
      expect(data[0]).toEqual(expectedData);
    });
});