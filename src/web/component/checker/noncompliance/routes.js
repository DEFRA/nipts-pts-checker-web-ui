"use strict";

import { NonComplianceHandlers } from "./handler.js";
import HttpMethod from "../../../../constants/httpMethod.js";

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/checker/non-compliance",
    options: {
     handler: NonComplianceHandlers.getNonComplianceHandler,
    } 
  },
];

export default Routes;
