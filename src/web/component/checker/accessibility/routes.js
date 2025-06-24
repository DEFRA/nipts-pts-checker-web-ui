
"use strict";

import { AccessibilityHandlers } from "./handler.js";
import HttpMethod from "../../../../constants/httpMethod.js";

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/accessibility-statement",
    options: {
      auth: false,
      handler: AccessibilityHandlers.getAccessibilityStatement,
    },
  },
];

export default Routes;

