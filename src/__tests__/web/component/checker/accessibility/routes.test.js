import Routes from "../../../../../web/component/checker/accessibility/routes.js";
import { AccessibilityHandlers } from "../../../../../web/component/checker/accessibility/handler.js";
import HttpMethod from "../../../../../constants/httpMethod.js";

describe("Routes", () => {
  it("should have a GET route for /accessibility-statement", () => {
    const foundRoute = Routes.find(
      (route) => route.path === "/accessibility-statement" && route.method === HttpMethod.GET
    );

    expect(foundRoute).toBeDefined();
    expect(foundRoute.options.handler).toBe(AccessibilityHandlers.getAccessibilityStatement);
  });

  it("should have auth set to false for /accessibility-statement route", () => {
    const foundRoute = Routes.find(
      (route) => route.path === "/accessibility-statement" && route.method === HttpMethod.GET
    );

    expect(foundRoute.options.auth).toBe(false);
  });

  it("should have exactly one route defined", () => {
    expect(Routes).toHaveLength(1);
  });

  it("should export Routes as default", () => {
    expect(Routes).toBeDefined();
    expect(Array.isArray(Routes)).toBe(true);
  });
});