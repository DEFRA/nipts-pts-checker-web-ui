"use strict";

import Routes from "./routes.js";

function register(server) {
  server.dependency(["@hapi/vision"]);

  server.route(Routes);

  server.log("info", "Plugin registered: MagicWord");
}

export default {
  name: "MagicWord",
  version: "1.0.0",
  register,
};