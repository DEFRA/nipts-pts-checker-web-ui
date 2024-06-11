"use strict";

import  { DashboardHandlers } from "./handler.js";
import  HttpMethod  from "../../../../constants/httpMethod.js";

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/checker/dashboard",
    config: DashboardHandlers.getDashboard.index,
  },
];

export default Routes;