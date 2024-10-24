import Routes from "../../../../../web/component/checker/referred/routes.js";


describe("Routes", () => {
  it("should have a GET route for /checker/referred", () => {
    const foundRoute = Routes.find(
      x => x.path === "/checker/referred" && x.method === "GET"
    );

    expect(foundRoute).toBeDefined();
    expect(foundRoute.options.handler).toBeDefined();
  });
});
