
"use strict";

import Routes from "./routes.js";

function register(server) {
  server.dependency(["@hapi/vision"]);

  server.route(Routes);

  server.log("info", "Plugin registered: Accessibility");
}

export default {
  name: "Accessibility",
  version: "1.0.0",
  register,
};
