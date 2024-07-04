import Wreck from "@hapi/wreck";
import FormData from "form-data";
import config from "../../config/index.js";
import session from "../../session/index.js";
import sessionKeys from "../../session/keys.js";

const redeemAuthorizationCodeForAccessToken = async (request) => {
  console.log(
    `${new Date().toISOString()} Requesting an access token with a client_secret`
  );

  try {
    const data = new FormData();
    // The Application (client) ID
    data.append("client_id", config.authConfig.defraId.clientId);
    data.append("client_secret", config.authConfig.defraId.clientSecret);
    // Allow apps to declare the resource they want the token for during token redemption.
    data.append("scope", config.authConfig.defraId.scope);
    // The authorization_code that you acquired in the first leg of the flow.
    data.append("code", request.query.code);
    // Must be authorization_code for the authorization code flow.
    data.append("grant_type", "authorization_code");
    // The same redirect_uri value that was used to acquire the authorization_code.
    data.append("redirect_uri", config.authConfig.defraId.redirectUri);
    // The same code_verifier that was used to obtain the authorization_code.
    data.append(
      "code_verifier",
      session.getPkcecodes(request, sessionKeys.pkcecodes.verifier)
    );

    const tokenUrl = `${config.authConfig.defraId.hostname}/${config.authConfig.defraId.policy}/oauth2/v2.0/token`;
    const headers = data.getHeaders
      ? data.getHeaders()
      : { "Content-Type": "multipart/form-data" };

    const tokenModel = {
      headers: headers,
      payload: data,
      json: true,
    };

    const response = await Wreck.post(tokenUrl, tokenModel);

    if (response.res.statusCode !== 200) {
      throw new Error(
        `HTTP ${response.res.statusCode} (${response.res.statusMessage})`
      );
    }
    return response.payload;
  } catch (error) {
    console.log(
      `${new Date().toISOString()} Error while requesting an access token: ${
        error.message
      }`
    );
    console.error(error);
    throw error;
  }
};

export default redeemAuthorizationCodeForAccessToken;
