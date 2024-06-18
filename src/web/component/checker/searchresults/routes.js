"use strict";

import { MicrochipHandlers } from "./handler.js";
import  HttpMethod  from "../../../../constants/httpMethod.js";

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/checker/search-results",
    config: MicrochipHandlers.getMicrochipDataHandler.index,
  },
];

export default Routes;