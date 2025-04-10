
"use strict";

import Routes from "./routes.js";

function register(server) {
  server.dependency(["@hapi/vision"]);

  server.route(Routes);

  server.log("info", "Plugin registered: Health Check");
}

export default {
  name: "HealthCheck",
  version: "1.0.0",
  register,
};
