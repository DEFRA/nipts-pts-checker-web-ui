const HEALTH_CHECK_PATH = "/health-check";

import Routes from "../../../../../web/component/checker/health/routes.js";
import { HealthHandlers } from "../../../../../web/component/checker/health/handler.js";
import HttpMethod from "../../../../../constants/httpMethod.js";

jest.mock("../../../../../web/component/checker/health/handler.js");

describe("Health Routes", () => {
  it("should define a GET route for /health-check", () => {
    const healthRoute = Routes.find(
      (route) =>
        route.path === HEALTH_CHECK_PATH && route.method === HttpMethod.GET
    );

    expect(healthRoute).toBeDefined();
  });

  it("should have auth disabled for health-check route", () => {
    const healthRoute = Routes.find(
      (route) => route.path === HEALTH_CHECK_PATH
    );

    expect(healthRoute.options.auth).toBe(false);
  });

  it("should use the correct handler function", () => {
    const healthRoute = Routes.find(
      (route) => route.path === HEALTH_CHECK_PATH
    );

    expect(healthRoute.options.handler).toBe(HealthHandlers.getHealth);
  });

  it("should only have one route defined", () => {
    expect(Routes).toHaveLength(1);
  });
});
