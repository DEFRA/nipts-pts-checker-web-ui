"use strict";

import currentSailingMainService from "../../../../api/services/currentSailingMainService.js";

const VIEW_PATH = "componentViews/checker/currentsailing/currentsailingView";

const Handler = {
  index: {
    plugins: {
      "hapi-auth-cookie": {
        redirectTo: false,
      },
    },
    handler: async (request, h) => {
      const currentSailingMainModelData = await currentSailingMainService.getCurrentSailingMain();
      return h.view(VIEW_PATH, { currentSailingMainModelData });
    },
  },
};

export default Handler;