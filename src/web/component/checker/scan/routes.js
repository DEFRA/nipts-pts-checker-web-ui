"use strict";

import { ScanHandlers } from "./handler.js";
import HttpMethod from "../../../../constants/httpMethod.js";

const ScanRoutes = [
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
];

export default ScanRoutes;
