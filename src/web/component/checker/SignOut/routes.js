"use strict";
import HttpMethod from "../../../../constants/httpMethod.js";

import logout from "../../../../lib/logout.js";
import config from "../../../../config/index.js";

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/signout",
    options: {
      auth: false,
      handler: async (request, h) => {
        logout(request);
        return h.redirect(config.authConfig.defraId.signOutUrl);
      },
    },
  },
];

export default Routes;
