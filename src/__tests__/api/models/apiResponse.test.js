import {
    OkResponse,
    BadRequestResponse,
    NotFoundResponse,
    ServerErrorResponse,
  } from "../../../api/models/apiResponse.js";;

describe("apiResponse", () => {
  describe("setValues for OKResponse", () => {
    it("should return correct data", async () => {
      const result = new OkResponse(200, "success")

      expect(result.status).toEqual(200);
      expect(result.data).toEqual("success");
    });
  });

  describe("setValues for BadRequestResponse", () => {
    it("should return correct data", async () => {
      const result = new BadRequestResponse(400, "Error", "Validation Error")

      expect(result.status).toEqual(400);
      expect(result.error).toEqual("Error");
      expect(result.validationErrors).toEqual("Validation Error");
    });
  });

  describe("setValues for NotFoundResponse", () => {
    it("should return correct data", async () => {
      const result = new NotFoundResponse(404, "Not Found")

      expect(result.status).toEqual(404);
      expect(result.error).toEqual("Not Found");
    });
  });

  describe("setValues for ServerErrorResponse", () => {
    it("should return correct data", async () => {
      const result = new ServerErrorResponse(500, "Server Error")

      expect(result.status).toEqual(500);
      expect(result.error).toEqual("Server Error");
    });
  });

});
