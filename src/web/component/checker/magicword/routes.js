"use strict";

import { MagicWordHandlers } from "./handler.js";
import HttpMethod from "../../../../constants/httpMethod.js";

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/checker/magic-word",
    options: {
      auth: false,
      handler: MagicWordHandlers.getMagicWord,
    },
  },
  {
    method: HttpMethod.POST,
    path: "/checker/magic-word",
    options: {
      auth: false,
      handler: MagicWordHandlers.checkMagicWord,
    },
  },
];

export default Routes;