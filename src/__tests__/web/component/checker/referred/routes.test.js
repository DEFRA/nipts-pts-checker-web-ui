import Routes from "../../../../../web/component/checker/referred/routes.js";
import { ReferredHandlers } from "../../../../../web/component/checker/referred/handler.js";

describe("Routes", () => {
  it("should have a GET route for /checker/referred", () => {
    const foundRoute = Routes.find(
      (x) => x.path === "/checker/referred" && x.method === "GET"
    );

    expect(foundRoute).toBeDefined();
    expect(foundRoute.options.handler).toBeDefined();
  });

  it("should use the correct handler for the /checker/referred GET route", () => {
    const foundRoute = Routes.find(
      (x) => x.path === "/checker/referred" && x.method === "GET"
    );

    expect(foundRoute.options.handler).toBe(ReferredHandlers.getReferredChecks);
  });
});
