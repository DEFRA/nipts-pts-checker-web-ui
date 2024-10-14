import Routes from "../../../../../web/component/checker/documentsearch/routes.js";


describe("Routes", () => {
  it("should have a GET route for /checker/document-search", () => {
    const foundRoute = Routes.find(
      (route) => route.path === "/checker/document-search" && route.method === "GET"
    );

    expect(foundRoute).toBeDefined();
    expect(foundRoute.options.handler).toBeDefined();
  });

});
