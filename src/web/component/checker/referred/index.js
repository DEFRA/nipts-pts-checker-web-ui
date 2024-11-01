"use strict";

import Routes from "./routes.js";

function register(server) {
  server.dependency(["@hapi/vision"]);

  server.route(Routes);

  server.log("info", "Plugin registered: referred");
}

export default {
  name: "Referred",
  version: "1.0.0",
  register,
};
