"use strict";

import Routes from "../../../../../web/component/checker/searchresults/routes.js";
import searchResultsPlugin from "../../../../../web/component/checker/searchresults/index.js";
import { SearchResultsHandlers } from "../../../../../web/component/checker/searchresults/handler.js";
import {
  validatePassOrFail
 } from "../../../../../web/component/checker/searchresults/validate.js";

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
    const foundRoute = Routes.find(
      (route) =>
        route.path === "/checker/search-results" && route.method === "GET"
    );

    expect(foundRoute).toBeDefined();
    expect(foundRoute.config).toEqual(
      SearchResultsHandlers.getSearchResultsHandler.index
    );
  });

  it("should have a POST route for /checker/search-results", () => {
    const foundRoute = Routes.find(
      (route) =>
        route.path === "/checker/search-results" && route.method === "POST"
    );

    expect(foundRoute).toBeDefined();
    expect(foundRoute.options.handler).toEqual(
      SearchResultsHandlers.saveAndContinueHandler
    );
  });
});
