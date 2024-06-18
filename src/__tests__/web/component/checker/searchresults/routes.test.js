"use strict";

import Routes from "../../../../../web/component/checker/searchresults/routes.js";
import searchResultsPlugin from "../../../../../web/component/checker/searchresults/index.js";

describe("searchResultsPlugin", () => {
  const server = {
    dependency: jest.fn(),
    route: jest.fn(),
    log: jest.fn(),
  };

  beforeAll(() => {
    searchResultsPlugin.register(server);
  });

  it("should register dependencies", () => {
    expect(server.dependency).toHaveBeenCalledWith(["@hapi/vision"]);
  });

  it("should register routes", () => {
    expect(server.route).toHaveBeenCalledWith(Routes);
  });

  it("should log plugin registration", () => {
    expect(server.log).toHaveBeenCalledWith(
      "info",
      "Plugin registered: searchresults"
    );
  });
});

describe("Routes", () => {
  it("should have a GET route for /checker/search-results", () => {
    const route = Routes.find(
      (route) =>
        route.path === "/checker/search-results" && route.method === "GET"
    );

    expect(route).toBeDefined();
  });

});
