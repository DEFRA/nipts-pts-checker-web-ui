import state from "./auth-code-grant/state.js";
import redeemAuthorizationCodeForAccessToken from "./auth-code-grant/redeem-authorization-code-for-access-token.js";
import jwtVerify from "./token-verify/jwt-verify.js";
import decodeJwt from "./token-verify/jwt-decode.js";
import nonce from "./id-token/nonce.js";
import expiresIn from "./auth-code-grant/expires-in.js";
import session from "../session/index.js";
import sessionKeys from "../session/keys.js";
import cookieAuthentication from "./cookie-auth/cookie-auth.js";
import { InvalidStateError } from "../exceptions/index.js";
import apiService from "../api/services/apiService.js";
import userService from "../api/services/userService.js";

const authenticate = async (request) => {
  if (!state.verify(request)) {
    throw new InvalidStateError("Invalid state");
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

  // Add or update checker user
  try {
    const organisation = userService.getUserOrganisation(request);

    let organisationId = null;
    let isGBCheck = true;

    if (organisation.organisationId !== "") {
      organisationId = organisation.organisationId;
      request.yar.set("organisationId", organisationId);
    }
    else{
      request.yar.clear("organisationId");
    }

    const userOrganisation = await apiService.getOrganisation(
      organisationId,
      request
    );

    if (
      userOrganisation?.Location &&
      typeof userOrganisation.Location === "string" &&
      userOrganisation.Location.toLowerCase().includes("ni")
    ) {
      isGBCheck = false;
    }

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
  } catch (error) {
    console.error("Error saving checker user:", error);

    // Rethrow the error
    throw error;
  }

  return accessToken;
};

export default authenticate;
