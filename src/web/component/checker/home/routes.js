"use strict";

import Handler from "./handler.js";

const Routes = [
  {
    method: "GET",
    path: "/checker/home",
    config: Handler.index,
  }
];

export default Routes;
