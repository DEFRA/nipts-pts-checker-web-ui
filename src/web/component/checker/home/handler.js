"use strict";

import appSettingsService from "../../../../api/services/appSettingsService.js";

const VIEW_PATH = "componentViews/checker/home/view";

const Handler = {
  index: {
    plugins: {
      "hapi-auth-cookie": {
        redirectTo: false,
      },
    },
    handler: async (request, h) => {
      const appSettings = await appSettingsService.getAppSettings();
      const model = { ...appSettings, loginUrl: "/checker/current-sailings" };

      return h.view(VIEW_PATH, { model });
    },
  },
};

export default Handler;
