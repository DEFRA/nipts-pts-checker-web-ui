import ScanRoutes from "../../../../../web/component/checker/scan/routes.js";
import HttpMethod from "../../../../../constants/httpMethod.js";

describe("Scan Routes", () => {
  it("should have a GET route for /checker/scan", () => {
    const foundRoute = ScanRoutes.find(
      (route) =>
        route.path === "/checker/scan" && route.method === HttpMethod.GET
    );

    expect(foundRoute).toBeDefined();
    expect(foundRoute.options.handler).toBeDefined();
  });

  it("should have a POST route for /checker/scan", () => {
    const foundRoute = ScanRoutes.find(
      (route) =>
        route.path === "/checker/scan" && route.method === HttpMethod.POST
    );

    expect(foundRoute).toBeDefined();
    expect(foundRoute.options.handler).toBeDefined();
  });

  it("should have a GET route for /checker/scan/not-found", () => {
    const foundRoute = ScanRoutes.find(
      (route) =>
        route.path === "/checker/scan/not-found" &&
        route.method === HttpMethod.GET
    );

    expect(foundRoute).toBeDefined();
    expect(foundRoute.options.handler).toBeDefined();
  });
});
