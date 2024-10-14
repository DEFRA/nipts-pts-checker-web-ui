import Routes from "../../../../../web/component/checker/home/routes.js";

describe("Routes", () => {
  it("should have a GET route for /", () => {
    const foundRoute = Routes.find(
      (route) => route.path === "/" && route.method === "GET"
    );

    expect(foundRoute).toBeDefined();
    expect(foundRoute.options.handler).toBeDefined();
  });
});
