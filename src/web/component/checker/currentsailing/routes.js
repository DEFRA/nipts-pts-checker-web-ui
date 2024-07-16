"use strict";

import { CurrentSailingHandlers } from "./handler.js";
import HttpMethod from "../../../../constants/httpMethod.js";
import { CurrentSailingValidation } from "./validate.js";

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/checker/current-sailings",
    options: {
      handler: CurrentSailingHandlers.getCurrentSailings,
    },
  },
  {
    method: HttpMethod.POST,
    path: "/checker/sailing-slot",
    options: {
      auth: false,
      validate: CurrentSailingValidation.validateSailings,
      handler: CurrentSailingHandlers.submitCurrentSailingSlot,
    },
  },
  {
    method: HttpMethod.GET,
    path: "/checker/sailing-slot",
    options: {
      auth: false,
      handler: CurrentSailingHandlers.getCurrentSailingSlot,
    },
  },
];

export default Routes;
