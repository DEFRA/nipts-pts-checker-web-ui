
import Routes from "../../../../../web/component/checker/noncompliance/routes.js";
import { NonComplianceHandlers } from "../../../../../web/component/checker/noncompliance/handler.js";

describe("Routes", () => {
  it("should have a GET route for /checker/non-compliance", () => {
    const route = Routes.find(
      (route) =>
        route.path === "/checker/non-compliance" && route.method === "GET"
    );

    expect(route).toBeDefined();
    expect(route.options.handler).toBe(
      NonComplianceHandlers.getNonComplianceHandler
    );
  });

  it("should have a POST route for /checker/non-compliance", () => {
    const route = Routes.find(
      (route) =>
        route.path === "/checker/non-compliance" && route.method === "POST"
    );

    expect(route).toBeDefined();
    expect(route.options.handler).toBe(
      NonComplianceHandlers.postNonComplianceHandler
    );
  });
});
