import state from "./auth-code-grant/state.js";
import redeemAuthorizationCodeForAccessToken from "./auth-code-grant/redeem-authorization-code-for-access-token.js";
import jwtVerify from "./token-verify/jwt-verify.js";
import decodeJwt from "./token-verify/jwt-decode.js";
import nonce from "./id-token/nonce.js";
import expiresIn from "./auth-code-grant/expires-in.js";
import session from "../session/index.js";
import sessionKeys from "../session/keys.js";
import cookieAuthentication from "./cookie-auth/cookie-auth.js";
import apiService from "../api/services/apiService.js";
import userService from "../api/services/userService.js";

const HTTP_STATUS = {
  FORBIDDEN: 403,
  SERVER_ERROR: 500,
};

const ERROR_VIEWS = {
  FORBIDDEN: "errors/403Error",
  SERVER_ERROR: "errors/500Error",
};

const authenticate = async (request, h) => {
  try {
    if (!state.verify(request)) {
      return h
        .view(ERROR_VIEWS.SERVER_ERROR)
        .code(HTTP_STATUS.SERVER_ERROR)
        .takeover();
    }

    const redeemResponse = await redeemAuthorizationCodeForAccessToken(request);
    await jwtVerify(redeemResponse.access_token);

    const accessToken = decodeJwt(redeemResponse.access_token);
    const idToken = decodeJwt(redeemResponse.id_token);
    nonce.verify(request, idToken);

    session.setToken(
      request,
      sessionKeys.tokens.accessToken,
      redeemResponse.access_token
    );
    session.setToken(
      request,
      sessionKeys.tokens.tokenExpiry,
      expiresIn.toISOString(redeemResponse.expires_in)
    );
    cookieAuthentication.set(request, accessToken);

    const organisation = userService.getUserOrganisation(request);
    const organisationId = organisation?.organisationId || null;

    if (!organisationId || organisationId.trim() === "") {
      session.clear(request);
      request.cookieAuth.clear();
      return h
        .view(ERROR_VIEWS.FORBIDDEN)
        .code(HTTP_STATUS.FORBIDDEN)
        .takeover();
    }

    request.yar.set("organisationId", organisationId);

    const userOrganisation = await apiService.getOrganisation(
      organisationId,
      request
    );
    const isGBCheck = !userOrganisation?.Location?.toLowerCase().includes("ni");

    const checker = {
      id: accessToken.sub,
      firstName: accessToken.firstName,
      lastName: accessToken.lastName,
      roleId: null,
      organisationId,
    };

    await apiService.saveCheckerUser(checker, request);
    request.yar.set("isGBCheck", isGBCheck);
    request.yar.set("checkerId", accessToken.sub);
    session.setToken(request, sessionKeys.tokens.sso, "");

    return accessToken;
  } catch (error) {
    session.clear(request);
    return h
      .view(ERROR_VIEWS.SERVER_ERROR)
      .code(HTTP_STATUS.SERVER_ERROR)
      .takeover();
  }
};

export default authenticate;
