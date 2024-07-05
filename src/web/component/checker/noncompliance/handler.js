"use strict";

import appSettingsService from "../../../../api/services/appSettingsService.js";

const VIEW_PATH = "componentViews/checker/noncompliance/noncomplianceView";

const Handler = {
  index: {
    plugins: {
      "hapi-auth-cookie": {
        redirectTo: false,
      },
    },
    handler: async (request, h) => {
      const appSettings = await appSettingsService.getAppSettings();
      const model = { ...appSettings };

      return h.view(VIEW_PATH, { model });
    },
  },
};

export default Handler;