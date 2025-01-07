"use strict";

import ScanRoutes from "./routes.js";

function register(server) {
  server.dependency(["@hapi/vision"]);
  server.route(ScanRoutes);
  server.log("info", "Plugin registered: scan");
}

export default {
  name: "Scan",
  version: "1.0.0",
  register,
};
