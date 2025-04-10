
import Routes from "../../../../../web/component/checker/health/routes.js";
import { HealthHandlers } from "../../../../../web/component/checker/health/handler.js";
import HttpMethod from "../../../../../constants/httpMethod.js";

jest.mock("../../../../../web/component/checker/health/handler.js");

describe("Health Routes", () => {
  it("should define a GET route for /health-check", () => {
    const healthRoute = Routes.find(
      (route) =>
        route.path === "/health-check" && route.method === HttpMethod.GET
    );

    expect(healthRoute).toBeDefined();
  });

  it("should have auth disabled for health-check route", () => {
    const healthRoute = Routes.find((route) => route.path === "/health-check");

    expect(healthRoute.options.auth).toBe(false);
  });

  it("should use the correct handler function", () => {
    const healthRoute = Routes.find((route) => route.path === "/health-check");

    expect(healthRoute.options.handler).toBe(HealthHandlers.getHealth);
  });

  it("should only have one route defined", () => {
    expect(Routes).toHaveLength(1);
  });
});
