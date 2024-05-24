import HttpMethodConstants from "../../constants/httpMethod.js";

describe("constants", () => {
  describe("HttpMethodConstants", () => {
    it("should return http method names", () => {
      expect(HttpMethodConstants.GET).toEqual("GET");
      expect(HttpMethodConstants.POST).toEqual("POST");
      expect(HttpMethodConstants.PUT).toEqual("PUT");
      expect(HttpMethodConstants.DELETE).toEqual("DELETE");
    });
  });
});
