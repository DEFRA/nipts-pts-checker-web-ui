"use strict";

import Handler from "./handler.js";

const Routes = [
  {
    method: "GET",
    path: "/startPage",
    config: Handler.startPage,
  },
];

export default Routes;
