"use strict";
import HttpMethod from "../../../../constants/httpMethod.js";
import session from "../../../../session/index.js";
import sessionKeys from "../../../../session/keys.js";

import dotenv from "dotenv";
dotenv.config();
if (process.env.NODE_ENV === "local" && !process.env.DEFRA_ID_CLIENT_ID) {
  dotenv.config({ path: "./.env.local", override: true });
}

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/account",
    options: {
      handler: async (request, h) => {
        session.setToken(request, sessionKeys.tokens.sso, "sso");

        const idmLink = process.env.ACCOUNT_MANAGEMENT_URL;
        return h.redirect(idmLink);
      },
    },
  },
];

export default Routes;
