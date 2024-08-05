import session from "../../session/index.js";
import sessionKeys from "../../session/keys.js";
import decodeJwt from "../../auth/token-verify/jwt-decode.js";

const getToken = (request) => {
  const token = session.getToken(request, sessionKeys.tokens.accessToken);
  return token;
};

const getUserOrganisation = (request) => {
  const accessToken = getToken(request);
  if (!accessToken) {
    return null;
  }

  const token = decodeJwt(accessToken);

  if (!token.relationships || token.relationships.length < 1) {
    return null;
  }

  const relationArray = token.relationships[0].split(":");

  if (relationArray.length > 2) {
    const organisation = {
      // A string value
      id: relationArray[1],
      name: relationArray[2],
      isGB: relationArray[2] === "GB",
      isSPS: relationArray[2] === "SPS",
    };

    return organisation;
  }

  return null;
};

export default {
  getToken,
  getUserOrganisation,
};
