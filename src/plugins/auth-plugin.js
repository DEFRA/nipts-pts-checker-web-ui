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
          ttl: config.cookie.ttl,  // TTL in milliseconds
        },
        keepAlive: true,
        redirectTo: (request) => {
          return auth.requestAuthorizationCodeUrl(session, request);
        },
        validateFunc: async (request, s) => {
          let result = { valid: false };

          const token = session.getToken(request, sessionKeys.tokens.accessToken);
          const sessionCreationCookie = request.state.sessionCreationTime;

          if (token) {
            // Session has a token, consider it valid
            result.valid = true;
          } else if (!sessionCreationCookie) {
            // No token and no creation time cookie, it's a new session
            console.log("New session detected, no token and no session creation time cookie");
          } else {
            // No token, but creation time cookie exists, session expired due to TTL
            const currentTime = Date.now();
            const sessionAge = currentTime - parseInt(sessionCreationCookie, 10);

            if (sessionAge > config.cookie.ttl) {
              console.log("Session expired due to TTL");
              request.cookieAuth.clear();
              return { valid: false };
            }
          }

          if (result.valid) {
            const sso = session.getToken(request, sessionKeys.tokens.sso);
            if (sso && sso === "sso") {
              result.valid = false;
            }
          }

          return result;
        },
      });

      server.auth.default({ strategy: "session", mode: "required" });

      //this should be polled using javascript on the client side. 
      server.route({
        method: 'GET',
        path: '/check-session',
        handler: (request, h) => {
          const token = session.getToken(request, sessionKeys.tokens.accessToken);
      
          //adjust this later on to check if the session is within 2 minutes to display the popup
          if (token) {
            return h.response({ success: true });
          }
          return h.response({sucess: false});
        },
        options: {
          auth: false,
        },
      });

      server.route({
        method: 'GET',
        path: '/timeout',
        handler: (request, h) => {
          request.cookieAuth.clear();
          h.unstate('sessionCreationTime');  // Clear the session creation time cookie on timeout
          const loginUrl = auth.requestAuthorizationCodeUrl(session, request);
          request.cookieAuth.clear();
          session.clear(request);

          const model = { loginUrl: loginUrl };
          const VIEW_PATH = "timeout/timeout-warning";

          return h.view(VIEW_PATH, { model });
        },
        options: {
          auth: false,
        },
      });

      // Pre-authentication check to see if the session has expired based on TTL
      server.ext('onPreAuth', (request, h) => {
        const isIdm2Page = request.path.includes('signin-oidc');

        if (isIdm2Page) {
          return h.continue;
        }

        const isStaticAsset = request.path.startsWith('/static/') || request.path.endsWith('.css') || request.path.endsWith('.js') || request.path.endsWith('.jpg') || request.path.endsWith('.png') || request.path.endsWith('.ico');
        const isLandingPage = ['/login', '/logout', '/', '/500error', '/timeout', '/password', '/timeout-warning'].includes(request.path);

        const token = session.getToken(request, sessionKeys.tokens.accessToken);
        const sessionCreationCookie = request.state.sessionCreationTime;

        if (!token && !isLandingPage && !isStaticAsset) {
          if (!sessionCreationCookie) {
            // No session creation cookie means it's a new session
            console.log("New session, redirecting to login");
            return h.redirect('/');
          } else {
            // Session creation cookie exists, but session might have expired
            const currentTime = Date.now();
            const sessionAge = currentTime - parseInt(sessionCreationCookie, 10);

            if (sessionAge > config.cookie.ttl) {
              console.log("Session expired due to TTL, redirecting to /timeout");
              request.cookieAuth.clear();
              h.unstate('sessionCreationTime');  // Clear the session creation time cookie
              return h.redirect('/timeout').takeover();
            }
          }
        }

        return h.continue;
      });

      // Store session creation time in a separate cookie at login
      server.ext('onPostAuth', (request, h) => {

        const isIdm2Page = request.path.includes('signin-oidc');

        if (isIdm2Page) {
          return h.continue;
        }

        if (!request.state.sessionCreationTime) {
          const currentTime = Date.now();
          h.state('sessionCreationTime', String(currentTime), {  // Convert timestamp to string
            isSameSite: config.cookie.isSameSite,
            isSecure: config.cookie.isSecure,
            path: config.cookiePolicy.path,
            ttl: null, // No automatic expiry for this cookie; managed manually
            isHttpOnly: true,
          });
        }

        return h.continue;
      });
    },
  },
};
