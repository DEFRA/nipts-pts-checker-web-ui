"use strict";

import Routes from "./routes.js";

function register(server) {
  server.dependency(["@hapi/vision"]);

  server.route(Routes);

  server.log("info", "Plugin registered: checkreportdetails");
}

export default {
  name: "CheckReportDetails",
  version: "1.0.0",
  register,
};
