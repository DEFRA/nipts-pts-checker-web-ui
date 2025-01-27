"use strict";

import { ScanHandlers } from "./handler.js";
import HttpMethod from "../../../../constants/httpMethod.js";

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/checker/scan",
    options: {
      handler: ScanHandlers.getScan,
    },
  },
  {
    method: HttpMethod.POST,
    path: "/checker/scan",
    options: {
      handler: ScanHandlers.postScan,
    },
  },
  {
    method: HttpMethod.GET,
    path: "/checker/scan/not-found",
    options: {
      handler: ScanHandlers.getScanNotFound,
    },
  },
];

export default Routes;
