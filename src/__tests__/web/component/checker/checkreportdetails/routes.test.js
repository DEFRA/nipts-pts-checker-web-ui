import Routes from "../../../../../web/component/checker/checkreportdetails/routes.js";

describe("Routes", () => {
  it("should have a GET route for /checker/checkreportdetails", () => {
    const foundRoute = Routes.find(
      (x) => x.path === "/checker/checkreportdetails" && x.method === "GET"
    );

    expect(foundRoute).toBeDefined();
    expect(foundRoute.options.handler).toBeDefined();
    expect(foundRoute.options.handler).toBeInstanceOf(Function);
  });

  it("should have a POST route for /checker/conduct-sps-check", () => {
    const foundRoute = Routes.find(
      (x) => x.path === "/checker/conduct-sps-check" && x.method === "POST"
    );

    expect(foundRoute).toBeDefined();
    expect(foundRoute.options.handler).toBeDefined();
    expect(foundRoute.options.handler).toBeInstanceOf(Function);
  });
});
