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
  {
    method: HttpMethod.POST,
    path: "/checker/referred",
    options: {
      handler: DashboardHandlers.postReferred,
    },
  },
];

export default Routes;
