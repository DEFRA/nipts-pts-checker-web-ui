import Routes from "../../../../../web/component/checker/currentsailing/routes.js";


describe("Routes", () => {
  it("should have a GET route for /checker/current-sailings", () => {
    const foundRoute = Routes.find(
      (route) => route.path === "/checker/current-sailings" && route.method === "GET"
    );

    expect(foundRoute).toBeDefined();
    expect(foundRoute.options.handler).toBeDefined();
  });


  it("should have a POST route for /checker/current-sailings", () => {
    const foundRoute = Routes.find(
      (route) => route.path === "/checker/current-sailings" && route.method === "POST"
    );

    expect(foundRoute).toBeDefined();
    expect(foundRoute.options.handler).toBeDefined();
  });


  it("should have a GET route for /checker/sailing-slot", () => {
    const foundRoute = Routes.find(
      (route) => route.path === "/checker/sailing-slot" && route.method === "GET"
    );

    expect(foundRoute).toBeDefined();
    expect(foundRoute.options.handler).toBeDefined();
  });

});
