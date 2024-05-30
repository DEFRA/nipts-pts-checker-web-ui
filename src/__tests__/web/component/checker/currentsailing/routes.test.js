import Routes from "../../../../../web/component/checker/currentsailing/routes.js";


describe("Routes", () => {
  it("should have a GET route for /checker/current-sailings", () => {
    const route = Routes.find(
      (route) => route.path === "/checker/current-sailings" && route.method === "GET"
    );

    expect(route).toBeDefined();
    expect(route.config.handler).toBeDefined();
  });


  it("should have a POST route for /checker/sailing-slot", () => {
    const route = Routes.find(
      (route) => route.path === "/checker/sailing-slot" && route.method === "POST"
    );

    expect(route).toBeDefined();
    expect(route.options.handler).toBeDefined();
  });


  it("should have a GET route for /checker/sailing-slot", () => {
    const route = Routes.find(
      (route) => route.path === "/checker/sailing-slot" && route.method === "GET"
    );

    expect(route).toBeDefined();
    expect(route.options.handler).toBeDefined();
  });

});
