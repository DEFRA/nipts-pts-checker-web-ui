import plugin from "../../../../../web/component/checker/checkreportdetails/index.js";

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
    expect(server.route).toHaveBeenCalledWith(expect.any(Array));
  });

  it('should call server.log with "info" and "Plugin registered: CheckReportDetails"', () => {
    plugin.register(server);
    expect(server.log).toHaveBeenCalledWith(
      "info",
      "Plugin registered: CheckReportDetails"
    );
  });
});
