"use strict";

import Handler from "./handler.js";

const Routes = [
  {
    method: "GET",
    path: "/",
    config: Handler.index,
  }
];

export default Routes;
