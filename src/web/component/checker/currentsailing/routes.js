"use strict";

import  { CurrentSailingHandlers } from "./handler.js";
import  HttpMethod  from "../../../../constants/httpMethod.js";

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/checker/current-sailings",
    config: CurrentSailingHandlers.getCurrentSailings.index,
  },
  {
    method: HttpMethod.POST,
    path: '/checker/sailing-slot',
    options: {
      handler: CurrentSailingHandlers.submitCurrentSailingSlot
    }
  },
  {
    method: HttpMethod.GET,
    path: '/checker/sailing-slot',
    options: {
      handler: CurrentSailingHandlers.getCurrentSailingSlot
    }
  },
];

export default Routes;