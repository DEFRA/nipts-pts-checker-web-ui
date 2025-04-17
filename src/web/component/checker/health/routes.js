
"use strict";

import { HealthHandlers } from "./handler.js";
import HttpMethod from "../../../../constants/httpMethod.js";

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/health",
    options: {
      auth: false,
      handler: HealthHandlers.getHealth,
    },
  },
];

export default Routes;
