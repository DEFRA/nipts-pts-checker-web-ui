import ScanRoutes from "../../../../../web/component/checker/scan/routes.js";

describe("Scan Routes", () => {
  it("should have a GET route for /checker/scan", () => {
    const foundRoute = ScanRoutes.find(
      (route) => route.path === "/checker/scan" && route.method === "GET"
    );

    expect(foundRoute).toBeDefined();
    expect(foundRoute.options.handler).toBeDefined();
  });

  it("should have a POST route for /checker/scan", () => {
    const foundRoute = ScanRoutes.find(
      (route) => route.path === "/checker/scan" && route.method === "POST"
    );

    expect(foundRoute).toBeDefined();
    expect(foundRoute.options.handler).toBeDefined();
  });
});
