import config from "../config/index.js";
import auth from "../auth/index.js";
import session from "../session/index.js";
import sessionKeys from "../session/keys.js";
import logout from "../lib/logout.js";
import decodeJwt from "../auth/token-verify/jwt-decode.js";

const SIGNIN_OIDC_PATH = "signin-oidc";
const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
};

const isTokenValid = (token) => {
  return !!token;
};

const isSessionExpired = (sessionCreationCookie) => {
  if (!sessionCreationCookie) {
    console.log(
      "New session detected, no token and no session creation time cookie"
    );
    return false;
  }

  const currentTime = Date.now();
  const sessionAge = currentTime - parseInt(sessionCreationCookie, 10);

  if (sessionAge > config.cookie.ttl) {
    console.log("Session expired due to TTL");
    return true;
  }

  return false;
};

const validateSession = async (request, _s) => {
  const result = { valid: false };

  const token = session.getToken(request, sessionKeys.tokens.accessToken);
  const sessionCreationCookie = request.state.sessionCreationTime;

  if (isTokenValid(token)) {
    result.valid = true;
  } else {
    const isExpired = isSessionExpired(sessionCreationCookie);
    if (isExpired) {
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
};

const isStaticAsset = (path) => {
  return (
    path.startsWith("/static/") ||
    path.endsWith(".css") ||
    path.endsWith(".js") ||
    path.endsWith(".jpg") ||
    path.endsWith(".png") ||
    path.endsWith(".ico")
  );
};

const isExemptRoute = (path) => {
  const exemptPaths = [
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
    "/health",
    "/accessibility-statement",
    "/signout"
  ];

  return path.includes(SIGNIN_OIDC_PATH) || exemptPaths.includes(path);
};

const validateTokenRoles = (token) => {
  try {
    const decodedToken = decodeJwt(token);
    if (
      !decodedToken.roles ||
      !Array.isArray(decodedToken.roles) ||
      decodedToken.roles.length === 0
    ) {
      console.log("User has no roles");
      return false;
    }

    const hasCheckerRole = decodedToken.roles.some(
      (role) => role.includes(":Checker:") || role === "Checker"
    );

    if (!hasCheckerRole) {
      console.log("User does not have Checker role");
      return false;
    }

    return true;
  } catch (error) {
    global.appInsightsClient.trackException({ exception: error });
    console.error("Error validating token:", error);
    return false;
  }
};

const checkAuthorization = (request, h) => {
  const isAuthorized = request.yar.get("isAuthorized");
  const organisationId = request.yar.get("organisationId");

  if (!isAuthorized || !organisationId) 
  {
    //we need to clean up the session, else we end up with a deadlocked session
    request.cookieAuth.clear();
    h.unstate("sessionCreationTime");
    logout(request);
    if (request.path && !request.path.includes("/errors/")) 
    {
      console.log("Missing authorization flags - redirecting to login");
      return h.redirect("/").takeover();
    }
  }

  const token = session.getToken(request, sessionKeys.tokens.accessToken);

  if (token) {
    const isValid = validateTokenRoles(token);
    if (!isValid) {
      logout(request);
      return h.redirect(`/${HTTP_STATUS.FORBIDDEN}error`).takeover();
    }
  } else {
    console.log("No token found - redirecting to login");
    logout(request);
    if (request.path && !request.path.includes("/errors/")) 
    {
      return h.redirect("/").takeover();
    }
  }

  return h.continue;
};

const handleSessionTimeout = (request, h) => {
  const token = session.getToken(request, sessionKeys.tokens.accessToken);
  const sessionCreationCookie = request.state.sessionCreationTime;

  if (!token) {
    if (!sessionCreationCookie) {
      console.log("New session, redirecting to login");
      return h.redirect("/");
    } else {
      const currentTime = Date.now();
      const sessionAge = currentTime - parseInt(sessionCreationCookie, 10);

      if (sessionAge > config.cookie.ttl) {
        console.log("Session expired due to TTL, redirecting to /timeout");
        request.cookieAuth.clear();
        h.unstate("sessionCreationTime");
        return h.redirect("/timeout").takeover();
      }
    }
  }

  return h.continue;
};

const createOrUpdateSessionTimeCookie = (request, h) => {
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
};

const createTimeoutRoute = (server) => {
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
};

const createCheckSessionRoute = (server) => {
  server.route({
    method: "GET",
    path: "/check-session",
    handler: (request, h) => {
      const token = session.getToken(request, sessionKeys.tokens.accessToken);

      if (token) {
        return h.response({ success: true });
      }
      return h.response({ success: false });
    },
    options: {
      auth: false,
    },
  });
};

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
        validateFunc: validateSession,
      });

      server.auth.default({ strategy: "session", mode: "required" });

      server.ext("onPreAuth", async (request, h) => {
        if (isStaticAsset(request.path) || isExemptRoute(request.path)) {
          return h.continue;
        }

        return checkAuthorization(request, h);
      });

      createCheckSessionRoute(server);
      createTimeoutRoute(server);

      server.ext("onPreAuth", (request, h) => {
        const isIdm2Page = request.path.includes(SIGNIN_OIDC_PATH);

        if (isIdm2Page) {
          return h.continue;
        }

        if (isStaticAsset(request.path) || isExemptRoute(request.path)) {
          return h.continue;
        }

        return handleSessionTimeout(request, h);
      });

      server.ext("onPostAuth", (request, h) => {
        const isIdm2Page = request.path.includes(SIGNIN_OIDC_PATH);

        if (isIdm2Page) {
          return h.continue;
        }

        return createOrUpdateSessionTimeCookie(request, h);
      });
    },
  },
};
