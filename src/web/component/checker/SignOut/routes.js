"use strict";
import HttpMethod from "../../../../constants/httpMethod.js";

import logout from "../../../../lib/logout.js";
import config from "../../../../config/index.js";

const VIEW_PATH = "componentViews/checker/SignOut/view";

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/signout",
    options: {
      auth: false,
      handler: async (request, h) => {
       logout(request);
       return h.redirect(config.authConfig.defraId.signOutUrl);
        // eturn h.view(VIEW_PATH, {});
      },
    },
  },
];

export default Routes;