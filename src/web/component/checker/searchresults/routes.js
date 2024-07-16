"use strict";

import { SearchResultsHandlers } from "./handler.js";
import HttpMethod from "../../../../constants/httpMethod.js";
import {
 validatePassOrFail
} from "./validate.js";

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/checker/search-results",
    options: {
      handler: SearchResultsHandlers.getSearchResultsHandler,
    },
  },
  {
    method: HttpMethod.POST,
    path: "/checker/non-compliance",
    options: {
      auth: false,
      validate: validatePassOrFail,
      handler: SearchResultsHandlers.saveAndContinueHandler,
    },
  },
];

export default Routes;
