import config from "../config/index.js";
import auth from "../auth/index.js";
import session from "../session/index.js";
import sessionKeys from "../session/keys.js";

export default {
  plugin: {
    name: "auth",
    register: async (server, _) => {
      server.auth.strategy("session", "cookie", {
        cookie: {
          isSameSite: config.cookie.isSameSite,
          isSecure: config.cookie.isSecure,
          name: config.cookie.cookieNameAuth,
          password: config.cookie.password,
          path: config.cookiePolicy.path,
          ttl: config.cookie.ttl,
        },
        keepAlive: true,
        redirectTo: (request) => {
          return auth.requestAuthorizationCodeUrl(session, request);
        },
        validateFunc: async (request, s) => {
          let result = { valid: false };

          if (session.getToken(request, sessionKeys.tokens.accessToken)) {
            result.valid = true;
          }

          return result;
        },
      });

      server.auth.default({ strategy: "session", mode: "required" });
    },
  },
};
