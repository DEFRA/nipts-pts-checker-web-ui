"use strict";

import appSettingsService from "../../../../api/services/appSettingsService.js";

const VIEW_PATH = "componentViews/checker/startPage/view";

const Handler = {
  startPage: {
    plugins: {
      "hapi-auth-cookie": {
        redirectTo: false,
      },
    },
    handler: async (request, h) => {
      const data = await appSettingsService.getAppSettings();
      return h.view(VIEW_PATH,  { model: data });
    },
  },
};

export default Handler;
