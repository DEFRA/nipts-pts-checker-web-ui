"use strict";
import HttpMethod from "../../../../constants/httpMethod.js";
import session from "../../../../session/index.js";
import sessionKeys from "../../../../session/keys.js";

import dotenv from "dotenv";
dotenv.config();

const unsafeNone = "unsafe-none";
const crossOrigin = "cross-origin";
const permissions = "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()";

if (process.env.NODE_ENV === "local" && !process.env.DEFRA_ID_CLIENT_ID) {
  dotenv.config({ path: "./.env.local", override: true });
}

const setSecurityHeaders = (response) => {
  response.header("X-Frame-Options", "DENY");
  response.header("X-Content-Type-Options", "nosniff");
  response.header(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
  );
  response.header("Referrer-Policy", "strict-origin-when-cross-origin");

  try {
    response.header(
      "Permissions-Policy",
      permissions
    );

    response.header(
      "Feature-Policy",
      "accelerometer 'none'; camera 'none'; geolocation 'none'; gyroscope 'none'; magnetometer 'none'; microphone 'none'; payment 'none'; usb 'none'"
    );

    response.header("Cross-Origin-Embedder-Policy", unsafeNone);
    response.header("Cross-Origin-Resource-Policy", crossOrigin);
    response.header("Cross-Origin-Opener-Policy", unsafeNone);
  } catch (error) {
    console.log("Error setting some headers:", error);
  }

  if (response.output?.headers) {
    response.output.headers["permissions-policy"] =
      permissions;
    response.output.headers["cross-origin-embedder-policy"] = unsafeNone;
    response.output.headers["cross-origin-resource-policy"] = crossOrigin;
    response.output.headers["cross-origin-opener-policy"] = unsafeNone;
  }

  return response;
};

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/account",
    options: {
      handler: async (request, h) => {
        session.setToken(request, sessionKeys.tokens.sso, "sso");

        const idmLink = process.env.ACCOUNT_MANAGEMENT_URL;

        const response = h.redirect(idmLink);

        setSecurityHeaders(response);

        response.header(
          "Permissions-Policy",
          permissions
        );
        response.header("Cross-Origin-Embedder-Policy", "require-corp");
        response.header("Cross-Origin-Resource-Policy", "same-origin");
        response.header("Cross-Origin-Opener-Policy", "same-origin");
        response.header(
          "Content-Security-Policy",
          "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
        );
        response.header("Referrer-Policy", "strict-origin-when-cross-origin");

        return response;
      },
    },
  },
];

export default Routes;
