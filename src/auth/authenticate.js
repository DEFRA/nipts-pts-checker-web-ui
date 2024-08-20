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
    const checker = {
      id: accessToken.sub,
      firstName: accessToken.firstName,
      lastName: accessToken.lastName,
      roleId: null,
    };

    await apiService.saveCheckerUser(checker, request);
  } catch (error) {
    console.error("Error saving checker user:", error);
  }

  return accessToken;
};

export default authenticate;
