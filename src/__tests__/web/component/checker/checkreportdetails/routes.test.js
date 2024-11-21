import Routes from "../../../../../web/component/checker/checkreportdetails/routes.js";


describe("Routes", () => {
  it("should have a GET route for /checker/checkreportdetails", () => {
    const foundRoute = Routes.find(
      (route) => route.path === "/checker/checkreportdetails" && route.method === "GET"
    );

    expect(foundRoute).toBeDefined();
    expect(foundRoute.options.handler).toBeDefined();
  });


  it("should have a POST route for /checker/checkreportdetails", () => {
    const foundRoute = Routes.find(
      (route) => route.path === "/checker/checkreportdetails" && route.method === "POST"
    );

    expect(foundRoute).toBeDefined();
    expect(foundRoute.options.handler).toBeDefined();
  });
});
