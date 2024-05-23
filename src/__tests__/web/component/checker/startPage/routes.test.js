import Routes from "../../../../../web/component/checker/startPage/routes.js";

describe("Routes", () => {
  it("should have a GET route for /startPage", () => {
    const route = Routes.find(
      (route) => route.path === "/startPage" && route.method === "GET"
    );

    expect(route).toBeDefined();
    expect(route.config.handler).toBeDefined();
  });
});
