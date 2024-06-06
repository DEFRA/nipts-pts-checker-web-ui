"use strict";

import  { DocumentSearchHandlers } from "./handler.js";
import  HttpMethod  from "../../../../constants/httpMethod.js";

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/checker/document-search",
    config: DocumentSearchHandlers.getDocumentSearch.index,
  }
];

export default Routes;