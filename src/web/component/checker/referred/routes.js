"use strict";

import { ReferredHandlers } from "./handler.js";
import HttpMethod from "../../../../constants/httpMethod.js";

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/checker/referred",
    options: {
      handler: ReferredHandlers.getReferredChecks,
    },
  },
  {
    method: HttpMethod.POST,
    path: "/checker/checkreport",
    options: {
      handler: ReferredHandlers.postCheckReport,
    },
  },
];

export default Routes;
