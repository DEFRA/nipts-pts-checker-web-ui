"use strict";

import { HomeHandlers } from "./handler.js";
import HttpMethod from "../../../../constants/httpMethod.js";

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/",
    options: {
      auth: false,
      handler: HomeHandlers.getHome,
    },
  },
];

export default Routes;
