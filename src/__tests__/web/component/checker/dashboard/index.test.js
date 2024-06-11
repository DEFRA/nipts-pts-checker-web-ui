import plugin from "../../../../../web/component/checker/dashboard/index.js";

describe("register function", () => {
  let server;

  beforeEach(() => {
    server = {
      dependency: jest.fn(),
      route: jest.fn(),
      log: jest.fn(),
    };
  });

  it('should call server.dependency with ["@hapi/vision"]', () => {
    plugin.register(server);
    expect(server.dependency).toHaveBeenCalledWith(["@hapi/vision"]);
  });

  it("should call server.route with Routes", () => {
    plugin.register(server);
    expect(server.route).toHaveBeenCalled();
  });

  it('should call server.log with "info" and "Plugin registered: dashboard"', () => {
    plugin.register(server);
    expect(server.log).toHaveBeenCalledWith("info", "Plugin registered: dashboard");
  });
});
