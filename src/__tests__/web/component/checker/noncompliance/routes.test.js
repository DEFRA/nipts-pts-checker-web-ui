
import Routes from "../../../../../web/component/checker/noncompliance/routes.js";
import { NonComplianceHandlers } from "../../../../../web/component/checker/noncompliance/handler.js";

describe("Routes", () => {
  it("should have a GET route for /checker/non-compliance", () => {
    const foundRoute = Routes.find(
      (route) =>
        route.path === "/checker/non-compliance" && route.method === "GET"
    );

    expect(foundRoute).toBeDefined();
    expect(foundRoute.options.handler).toBe(
      NonComplianceHandlers.getNonComplianceHandler
    );
  });

  it("should have a POST route for /checker/non-compliance", () => {
    const foundRoute = Routes.find(
      (route) =>
        route.path === "/checker/non-compliance" && route.method === "POST"
    );

    expect(foundRoute).toBeDefined();
    expect(foundRoute.options.handler).toBe(
      NonComplianceHandlers.postNonComplianceHandler
    );
  });

  it("should have a POST route for /checker/non-compliance-back", () => {
    const foundRoute = Routes.find(
      (route) =>
        route.path === "/checker/non-compliance-back" && route.method === "POST"
    );

    expect(foundRoute).toBeDefined();
    expect(foundRoute.options.handler).toBe(
      NonComplianceHandlers.postNonComplianceBackHandler
    );
  });
});
