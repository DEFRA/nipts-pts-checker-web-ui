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
        
        const response = h.redirect(idmLink);

        response.header("X-Frame-Options", "DENY");
        response.header("X-Content-Type-Options", "nosniff");
        response.header("Referrer-Policy", "strict-origin-when-cross-origin");
        response.header(
          "Permissions-Policy",
          "camera=(), microphone=(), geolocation=(), payment=()"
        );
        response.header("Cross-Origin-Embedder-Policy", "unsafe-none");
        response.header("Cross-Origin-Resource-Policy", "cross-origin");
        response.header("Cross-Origin-Opener-Policy", "unsafe-none");

        const accountDomain = new URL(idmLink).origin;

        response.header(
          "Content-Security-Policy",
          "default-src 'self'; " +
            "script-src 'self' 'unsafe-inline'; " +
            "style-src 'self' 'unsafe-inline'; " +
            "img-src 'self' data: https:; " +
            "font-src 'self'; " +
            "connect-src 'self' " +
            accountDomain +
            "; " +
            "frame-ancestors 'none'; " +
            "base-uri 'self'; " +
            "form-action 'self' " +
            accountDomain
        );

        return response;
      },
    },
  },
];

export default Routes;
