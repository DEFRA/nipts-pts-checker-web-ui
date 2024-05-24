"use strict";

import Handler from "./handler.js";
import HttpMethodConstants from "../../../../constants/httpMethod.js";

const Routes = [
  {
    method: HttpMethodConstants.GET,
    path: "/",
    config: Handler.index,
  },
];

export default Routes;
