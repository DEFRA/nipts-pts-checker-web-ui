import {
  CheckerMainModel
  } from "../../../api/models/checkerMainModel.js";;

describe("checkerMainModel", () => {
describe("setValues for checkerMainModel", () => {
    it("should return correct data", async () => {
      const result = new CheckerMainModel("Main Service")

      expect(result.serviceName).toEqual("Main Service");
    });
  });

});
