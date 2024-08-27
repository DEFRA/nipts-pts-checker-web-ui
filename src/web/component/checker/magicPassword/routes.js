"use strict";

import { MagicPasswordHandlers } from "./handler.js";
import HttpMethod from "../../../../constants/httpMethod.js";

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/password",
    options: {
      auth: false,
      handler: MagicPasswordHandlers.getMagicPassword,
    },
  },
  {
    method: HttpMethod.POST,
    path: "/password",
    options: {
      auth: false,
      handler: MagicPasswordHandlers.submitMagicPassword,
    },
  },
];

export default Routes;
