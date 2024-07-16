import Routes from "../../../../../web/component/checker/dashboard/routes.js";


describe("Routes", () => {
  it("should have a GET route for /checker/dashboard", () => {
    const route = Routes.find(
      x => x.path === "/checker/dashboard" && x.method === "GET"
    );

    expect(route).toBeDefined();
    expect(route.options.handler).toBeDefined();
  });
});
