"use strict";

import Joi from "joi";
import Path from "path";
import checkerMainService from "../../../../api/services/checkerMainService.js";

const VIEW_PATH = "componentViews/checker/home/homeView";

const Handler = {
  index: {
    plugins: {
      "hapi-auth-cookie": {
        redirectTo: false,
      },
    },
    handler: async (request, h) => {
      const checkerMainModelData = await checkerMainService.getCheckerMain();
      return h.view(VIEW_PATH, { checkerMainModelData });
    },
  },
};

export default Handler;