import Routes from "../../../../../web/component/checker/error/routes.js";


describe("Routes", () => {
  it("should have a GET route for /checker/500Error", () => {
    const foundRoute = Routes.find(
      (route) => route.path === "/checker/500Error" && route.method === "GET"
    );

    expect(foundRoute).toBeDefined();
    expect(foundRoute.options.handler).toBeDefined();
  });
});
