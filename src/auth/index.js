import cookieAuth from "./cookie-auth/cookie-auth.js";
import requestAuthorizationCodeUrl from "./auth-code-grant/request-authorization-code-url.js";
import authenticate from "./authenticate.js";

export default {
  requestAuthorizationCodeUrl: requestAuthorizationCodeUrl,
  authenticate: authenticate,
  setAuthCookie: cookieAuth.setAuthCookie,
  clearAuthCookie: cookieAuth.clear,
};
