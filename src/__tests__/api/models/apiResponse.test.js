import {
    OkResponse,
    BadRequestResponse,
    NotFoundResponse,
    ServerErrorResponse,
  } from "../../../api/models/apiResponse.js";

  const success200 = 200;
  const badRequestResponse400 = 400;
  const ForbiddenResponse403 = 403;
  const notFoundResponse404 = 404;
  const serverError500 = 500;

describe("apiResponse", () => {
  describe("setValues for OKResponse", () => {
    it("should return correct data", async () => {
      const result = new OkResponse(success200, "success")

      expect(result.status).toEqual(success200);
      expect(result.data).toEqual("success");
    });
  });

  describe("setValues for BadRequestResponse", () => {
    it("should return correct data Validation Error", async () => {
      const result = new BadRequestResponse(badRequestResponse400, "Error", "Validation Error")

      expect(result.status).toEqual(badRequestResponse400);
      expect(result.error).toEqual("Error");
      expect(result.validationErrors).toEqual("Validation Error");
    });
  });

  describe("setValues for ForbiddenResponse", () => {
    it("should return correct data Forbidden", async () => {
      const result = new NotFoundResponse(ForbiddenResponse403, "Forbidden")

      expect(result.status).toEqual(ForbiddenResponse403);
      expect(result.error).toEqual("Forbidden");
    });
  });

  describe("setValues for NotFoundResponse", () => {
    it("should return correct data Not Found", async () => {
      const result = new NotFoundResponse(notFoundResponse404, "Not Found")

      expect(result.status).toEqual(notFoundResponse404);
      expect(result.error).toEqual("Not Found");
    });
  });

  describe("setValues for ServerErrorResponse Server Error", () => {
    it("should return correct data", async () => {
      const result = new ServerErrorResponse(serverError500, "Server Error")

      expect(result.status).toEqual(serverError500);
      expect(result.error).toEqual("Server Error");
    });
  });

});
