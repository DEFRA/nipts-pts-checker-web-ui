"use strict";

import { DashboardHandlers } from "./handler.js";
import HttpMethod from "../../../../constants/httpMethod.js";
import checkMagicWord from "../../../helper/checkMagicWord.js";

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/checker/dashboard",
    options: {
      pre: [checkMagicWord], // Apply the magic word check
      handler: DashboardHandlers.getDashboard,
    },
  },
];

export default Routes;
