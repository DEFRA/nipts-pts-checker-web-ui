"use strict";

import { ReferredHandlers } from "./handler.js";
import HttpMethod from "../../../../constants/httpMethod.js";

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/checker/checkreportdetails",
    options: {
      handler: ReferredHandlers.getCheckDetails,
    },
  },
  {
    method: HttpMethod.POST,
    path: "/checker/checkreportdetails",
    options: {
      handler: ReferredHandlers.getCheckDetails,
    },
  }
];

export default Routes;
