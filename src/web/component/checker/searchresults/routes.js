"use strict";

import { SearchResultsHandlers } from "./handler.js";
import HttpMethod from "../../../../constants/httpMethod.js";

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/checker/search-results",
    options: {
      handler: SearchResultsHandlers.getSearchResultsHandler,
    },
  },
  {
    method: HttpMethod.GET,
    path: "/checker/search-results-ptd/{ptdNumber}",
    options: {
      handler: SearchResultsHandlers.getSearchResultsPTDHandler,
    },
  },
  {
    method: HttpMethod.POST,
    path: "/checker/search-results",
    options: {
      handler: SearchResultsHandlers.saveAndContinueHandler,
    },
  },
];

export default Routes;
