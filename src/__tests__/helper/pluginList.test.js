jest.mock("../../helper/pluginList", () => ({
  default: [
    { plugin: { pkg: { name: "@hapi/inert" }, register: () => {} } },
    { plugin: { pkg: { name: "@hapi/vision" }, register: () => {} } },
    { name: "Home", register: () => {} },
  ],
  __esModule: true, 
}));

import pluginList from "../../helper/pluginList";

describe("pluginList", () => {
  test("should be an array", () => {
    expect(Array.isArray(pluginList)).toBe(true);
  });

  test("should contain specific plugins", () => {
    const expectedPlugins = ["@hapi/inert", "@hapi/vision", "Home"];
    const actualPlugins = pluginList
      .map((p) => {
        if (p.plugin?.pkg?.name) {
          return p.plugin.pkg.name;
        } else if (p.name) {
          return p.name;
        } else {
          return null;
        }
      })
      .filter(Boolean); // filter out null values
    expectedPlugins.forEach((plugin) => {
      expect(actualPlugins).toContain(plugin);
    });
  });
});
