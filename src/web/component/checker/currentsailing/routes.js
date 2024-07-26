"use strict";

import { CurrentSailingHandlers } from "./handler.js";
import HttpMethod from "../../../../constants/httpMethod.js";
import checkMagicWord from "../../../helper/checkMagicWord.js";

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/checker/current-sailings",
    options: {
      pre: [checkMagicWord], // Apply the magic word check
      handler: CurrentSailingHandlers.getCurrentSailings,
    },
  },
  {
    method: HttpMethod.POST,
    path: "/checker/sailing-slot",
    options: {
      handler: CurrentSailingHandlers.submitCurrentSailingSlot,
    },
  },
  {
    method: HttpMethod.GET,
    path: "/checker/sailing-slot",
    options: {
      handler: CurrentSailingHandlers.getCurrentSailingSlot,
    },
  },
];

export default Routes;
