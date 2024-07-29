"use strict";

import { HomeHandlers } from "./handler.js";
import HttpMethod from "../../../../constants/httpMethod.js";
import checkMagicWord from "../../../helper/checkMagicWord.js";

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/",
    options: {
      pre: [checkMagicWord], // Apply the magic word check
      auth: false,     
      handler: HomeHandlers.getHome,
    },
  },
];

export default Routes;
