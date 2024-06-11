"use strict";

import documentSearchMainService from "../../../../api/services/documentSearchMainService.js";

const VIEW_PATH = "componentViews/checker/documentsearch/documentSearchView";

const getDocumentSearch = {
  index: {
    plugins: {
      "hapi-auth-cookie": {
        redirectTo: false,
      },
    },
    handler: async (request, h) => {
      const documentSearchMainModelData = await documentSearchMainService.getDocumentSearchMain();
      return h.view(VIEW_PATH, { documentSearchMainModelData });
    },
  },
};


export const DocumentSearchHandlers = {
    getDocumentSearch,
};
