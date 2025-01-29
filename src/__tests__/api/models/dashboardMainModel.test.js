import {
    DashboardMainModel
    } from "../../../api/models/dashboardMainModel.js";;
  
  describe("dashboardMainModel", () => {
   describe("setValues for dashboardMainModel", () => {
      it("should return correct data", async () => {
 
        const result = new DashboardMainModel ({
          routeName: "Test Route",
          operatorName: "Test Operator Name",
          departurePort: "Test Departure Port",
          arrivalPort: "Test Arrival Port",
          departureDate: "11/11/2024",
          departureTime: "19:34",
          passCount: 0,
          failCount: 2, 
          failReason: "Fail Reason",
          viewDetailsLink: "View",
        });
  
        expect(result.routeName).toEqual("Test Route");
        expect(result.operatorName).toEqual("Test Operator Name");
        expect(result.departurePort).toEqual("Test Departure Port");
        expect(result.arrivalPort).toEqual("Test Arrival Port");
        expect(result.departureDate).toEqual("11/11/2024");
        expect(result.departureTime).toEqual("19:34");
        expect(result.passCount).toEqual(0);
        expect(result.failCount).toEqual(2);
        expect(result.failReason).toEqual("Fail Reason");
        expect(result.viewDetailsLink).toEqual("View");
      });
    });
  
  });