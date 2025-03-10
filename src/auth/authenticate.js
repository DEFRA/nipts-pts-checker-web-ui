import state from "./auth-code-grant/state.js";
import redeemAuthorizationCodeForAccessToken from "./auth-code-grant/redeem-authorization-code-for-access-token.js";
import jwtVerify from "./token-verify/jwt-verify.js";
import decodeJwt from "./token-verify/jwt-decode.js";
import validateToken from "./validateToken.js";
import nonce from "./id-token/nonce.js";
import expiresIn from "./auth-code-grant/expires-in.js";
import sessionKeys from "../session/keys.js";
import cookieAuthentication from "./cookie-auth/cookie-auth.js";
import { InvalidStateError, UnauthorizedError } from "../exceptions/index.js";
import apiService from "../api/services/apiService.js";

const authenticate = async (request, sessionInstance) => {
  if (!state.verify(request)) {
    throw new InvalidStateError("Invalid state");
  }

  const redeemResponse = await redeemAuthorizationCodeForAccessToken(request);

  await jwtVerify(redeemResponse.access_token);

  const tokenData = validateToken(redeemResponse.access_token);

  const idToken = decodeJwt(redeemResponse.id_token);

  nonce.verify(request, idToken);

  sessionInstance.setToken(
    request,
    sessionKeys.tokens.accessToken,
    redeemResponse.access_token
  );

  sessionInstance.setToken(
    request,
    sessionKeys.tokens.tokenExpiry,
    expiresIn.toISOString(redeemResponse.expires_in)
  );

  cookieAuthentication.set(request, tokenData);

  try {
    const organisationId = tokenData.organisationId;
    let isGBCheck = true;

    if (organisationId) {
      request.yar.set("organisationId", organisationId);
    } else {
      request.yar.clear("organisationId");
    }

    const userOrganisation = await apiService.getOrganisation(
      organisationId,
      request
    );

    if (userOrganisation.error) {
      throw new ForbiddenError(
        `Forbidden: Organization not found: ${organisationId}`
      );
    }

    if (!userOrganisation.IsActive) {
      throw new ForbiddenError(
        `Forbidden: Organization is inactive: ${organisationId}`
      );
    }

    if (
      userOrganisation?.Location &&
      typeof userOrganisation.Location === "string" &&
      userOrganisation.Location.toLowerCase().includes("ni")
    ) {
      isGBCheck = false;
    }

    const checker = {
      id: tokenData.userId,
      firstName: tokenData.firstName,
      lastName: tokenData.lastName,
      roleId: null,
      organisationId: tokenData.organisationId,
    };

    await apiService.saveCheckerUser(checker, request);

    request.yar.set("isGBCheck", isGBCheck);
    request.yar.set("checkerId", tokenData.userId);
    request.yar.set("isAuthorized", true);
    sessionInstance.setToken(request, sessionKeys.tokens.sso, "");
  } catch (error) {
    console.error("Error during authentication:", error);
    throw error;
  }

  return tokenData;
};

export default authenticate;
