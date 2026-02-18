"use strict";

import { ErrorHandlers } from "./handler.js";
import HttpMethod from "../../../../constants/httpMethod.js";

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/checker/500Error",
    options: {
      handler: ErrorHandlers.get500Error,
    },
  },
];

export default Routes;