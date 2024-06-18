"use strict";

const VIEW_PATH = "componentViews/checker/searchresults/searchResultsView";

const getMicrochipDataHandler = {
  index: {
    plugins: {
      "hapi-auth-cookie": {
        redirectTo: false,
      },
    },
    handler: async (request, h) => {
      const microchipNumber = request.yar.get("microchipNumber");
      const data = request.yar.get("data");
      return h.view(VIEW_PATH, { microchipNumber, data });
    },
  },
};

export const MicrochipHandlers = {
  getMicrochipDataHandler,
};
