"use strict";

import Handler from "./handler.js";
import HttpMethod from "../../../../constants/httpMethod.js";

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/checker/non-compliance",
    config: Handler.index,
  },
];

export default Routes;
