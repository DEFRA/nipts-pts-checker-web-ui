"use strict";

import { SearchResultsHandlers } from "./handler.js";
import  HttpMethod  from "../../../../constants/httpMethod.js";

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/checker/search-results",
    config: SearchResultsHandlers.getSearchResultsHandler.index,
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