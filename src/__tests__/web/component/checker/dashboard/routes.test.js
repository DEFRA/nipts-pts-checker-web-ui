import Routes from "../../../../../web/component/checker/dashboard/routes.js";


describe("Routes", () => {
  it("should have a GET route for /checker/dashboard", () => {
    const foundRoute = Routes.find(
      x => x.path === "/checker/dashboard" && x.method === "GET"
    );

    expect(foundRoute).toBeDefined();
    expect(foundRoute.options.handler).toBeDefined();
  });
});
