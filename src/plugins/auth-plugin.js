import config from "../config/index.js";
import auth from "../auth/index.js";
import session from "../session/index.js";
import sessionKeys from "../session/keys.js";
import logout from "../lib/logout.js";
import decodeJwt from "../auth/token-verify/jwt-decode.js";

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
        validateFunc: async (request, _s) => {
          const result = { valid: false };

          const token = session.getToken(
            request,
            sessionKeys.tokens.accessToken
          );
          const sessionCreationCookie = request.state.sessionCreationTime;

          if (token) {
            result.valid = true;
          } else if (!sessionCreationCookie) {
            console.log(
              "New session detected, no token and no session creation time cookie"
            );
          } else {
            const currentTime = Date.now();
            const sessionAge =
              currentTime - parseInt(sessionCreationCookie, 10);

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

      server.ext("onPreAuth", async (request, h) => {
        const isStaticAsset =
          request.path.startsWith("/static/") ||
          request.path.endsWith(".css") ||
          request.path.endsWith(".js") ||
          request.path.endsWith(".jpg") ||
          request.path.endsWith(".png") ||
          request.path.endsWith(".ico");
        const isExemptRoute =
          request.path.includes("signin-oidc") ||
          [
            "/login",
            "/logout",
            "/",
            "/401error",
            "/403error",
            "/404error",
            "/500error",
            "/timeout",
            "/password",
            "/timeout-warning",
          ].includes(request.path);

        if (isStaticAsset || isExemptRoute) {
          return h.continue;
        }

        const isAuthorized = request.yar.get("isAuthorized");
        const organisationId = request.yar.get("organisationId");

        if (!isAuthorized || !organisationId) {
          console.log("Missing authorization flags - redirecting to login");
          logout(request);
          return h.redirect("/").takeover();
        }

        const token = session.getToken(request, sessionKeys.tokens.accessToken);

        if (token) {
          try {
            const decodedToken = decodeJwt(token);
            if (
              !decodedToken.roles ||
              !Array.isArray(decodedToken.roles) ||
              decodedToken.roles.length === 0
            ) {
              console.log("User has no roles");
              logout(request);
              return h.redirect("/401error").takeover();
            }

            const hasCheckerRole = decodedToken.roles.some(
              (role) => role.includes(":Checker:") || role === "Checker"
            );

            if (!hasCheckerRole) {
              console.log("User does not have Checker role");
              logout(request);
              return h.redirect("/401error").takeover();
            }
          } catch (error) {
            console.error("Error validating token:", error);
            logout(request);
            return h.redirect("/").takeover();
          }
        } else {
          console.log("No token found - redirecting to login");
          logout(request);
          return h.redirect("/").takeover();
        }

        return h.continue;
      });

      server.route({
        method: "GET",
        path: "/check-session",
        handler: (request, h) => {
          const token = session.getToken(
            request,
            sessionKeys.tokens.accessToken
          );

          if (token) {
            return h.response({ success: true });
          }
          return h.response({ success: false });
        },
        options: {
          auth: false,
        },
      });

      server.route({
        method: "GET",
        path: "/timeout",
        handler: (request, h) => {
          request.cookieAuth.clear();
          h.unstate("sessionCreationTime");
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

      server.ext("onPreAuth", (request, h) => {
        const isIdm2Page = request.path.includes("signin-oidc");

        if (isIdm2Page) {
          return h.continue;
        }

        const isStaticAsset =
          request.path.startsWith("/static/") ||
          request.path.endsWith(".css") ||
          request.path.endsWith(".js") ||
          request.path.endsWith(".jpg") ||
          request.path.endsWith(".png") ||
          request.path.endsWith(".ico");
        const isLandingPage = [
          "/login",
          "/logout",
          "/",
          "/500error",
          "/401error",
          "/403error",
          "/timeout",
          "/password",
          "/timeout-warning",
        ].includes(request.path);

        const token = session.getToken(request, sessionKeys.tokens.accessToken);
        const sessionCreationCookie = request.state.sessionCreationTime;

        if (!token && !isLandingPage && !isStaticAsset) {
          if (!sessionCreationCookie) {
            console.log("New session, redirecting to login");
            return h.redirect("/");
          } else {
            const currentTime = Date.now();
            const sessionAge =
              currentTime - parseInt(sessionCreationCookie, 10);

            if (sessionAge > config.cookie.ttl) {
              console.log(
                "Session expired due to TTL, redirecting to /timeout"
              );
              request.cookieAuth.clear();
              h.unstate("sessionCreationTime");
              return h.redirect("/timeout").takeover();
            }
          }
        }

        return h.continue;
      });

      server.ext("onPostAuth", (request, h) => {
        const isIdm2Page = request.path.includes("signin-oidc");

        if (isIdm2Page) {
          return h.continue;
        }

        if (!request.state.sessionCreationTime) {
          const currentTime = Date.now();
          h.state("sessionCreationTime", String(currentTime), {
            isSameSite: config.cookie.isSameSite,
            isSecure: config.cookie.isSecure,
            path: config.cookiePolicy.path,
            ttl: null,
            isHttpOnly: true,
          });
        }

        return h.continue;
      });
    },
  },
};
