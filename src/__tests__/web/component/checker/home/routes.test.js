import Routes from "../../../../../web/component/checker/home/routes.js";

describe("Routes", () => {
  it("should have a GET route for /", () => {
    const route = Routes.find(
      (route) => route.path === "/" && route.method === "GET"
    );

    expect(route).toBeDefined();
    expect(route.config.handler).toBeDefined();
  });
});
