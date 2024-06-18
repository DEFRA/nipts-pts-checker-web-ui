"use strict";

import  { DocumentSearchHandlers } from "./handler.js";
import  HttpMethod  from "../../../../constants/httpMethod.js";
import  { documentSearchValidation } from "./validate.js";

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/checker/document-search",
    config: DocumentSearchHandlers.getDocumentSearch.index,
  },
  {
    method: HttpMethod.POST,
    path: '/checker/document-search',
    options: {
      validate: documentSearchValidation.validateDocumentSearch,
      handler: DocumentSearchHandlers.submitDocumentSearch
    }
  }
];

export default Routes;