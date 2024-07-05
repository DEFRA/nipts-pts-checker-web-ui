"use strict";

import { DashboardHandlers } from "./handler.js";
import HttpMethod from "../../../../constants/httpMethod.js";

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/checker/dashboard",
    options: {
      handler: DashboardHandlers.getDashboard,
    },
  },
];

export default Routes;
