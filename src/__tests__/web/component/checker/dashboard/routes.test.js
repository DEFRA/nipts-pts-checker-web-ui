import Routes from "../../../../../web/component/checker/dashboard/routes.js";


describe("Routes", () => {
  it("should have a GET route for /checker/dashboard", () => {
    const route = Routes.find(
      (route) => route.path === "/checker/dashboard" && route.method === "GET"
    );

    expect(route).toBeDefined();
    expect(route.config.handler).toBeDefined();
  });
});
