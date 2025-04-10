import plugin from "../../../../../web/component/checker/health/index.js";

describe("HealthCheck plugin", () => {
  let server;

  beforeEach(() => {
    server = {
      dependency: jest.fn(),
      route: jest.fn(),
      log: jest.fn(),
    };
  });

  it("should call server.dependency with @hapi/vision", () => {
    plugin.register(server);
    expect(server.dependency).toHaveBeenCalledWith(["@hapi/vision"]);
  });

  it("should call server.route with Routes", () => {
    plugin.register(server);
    expect(server.route).toHaveBeenCalled();
  });

  it("should log plugin registration", () => {
    plugin.register(server);
    expect(server.log).toHaveBeenCalledWith(
      "info",
      "Plugin registered: Health Check"
    );
  });

  it("should have correct plugin metadata", () => {
    expect(plugin.name).toBe("HealthCheck");
    expect(plugin.version).toBe("1.0.0");
    expect(typeof plugin.register).toBe("function");
  });
});
