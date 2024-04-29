import Routes from "../../../../../web/component/checker/home/routes.js";

describe("Routes", () => {
    it("should have a GET route for /checker/home", () => {
        const route = Routes.find(
            (route) => route.path === "/checker/home" && route.method === "GET"
        );
        expect(route).toBeDefined();
        expect(route.config.handler).toBeDefined();
    });
});
