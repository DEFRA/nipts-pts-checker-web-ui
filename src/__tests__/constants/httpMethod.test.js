import HttpMethod from "../../constants/httpMethod.js";

describe("constants", () => {
  describe("HttpMethodConstants", () => {
    it("should return http method names", () => {
      expect(HttpMethod.GET).toEqual("GET");
      expect(HttpMethod.POST).toEqual("POST");
      expect(HttpMethod.PUT).toEqual("PUT");
      expect(HttpMethod.DELETE).toEqual("DELETE");
    });
  });
});
