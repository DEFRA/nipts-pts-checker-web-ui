import config from "../../config/index.js";
import nonce from "../id-token/nonce.js";
import state from "./state.js";
import pkce from "./proof-key-for-code-exchange.js";

const requestAuthorizationCodeUrl = (
  session,
  request,
  useProofKeyForCodeExchange = true
) => {
  const url = new URL(
    `${config.authConfig.defraId.hostname}${config.authConfig.defraId.oAuthAuthorisePath}`
  );
  url.searchParams.append("p", config.authConfig.defraId.policy);
  url.searchParams.append("client_id", config.authConfig.defraId.clientId);
  url.searchParams.append("nonce", nonce.generate(request));
  url.searchParams.append(
    "redirect_uri",
    config.authConfig.defraId.redirectUri
  );
  url.searchParams.append("scope", config.authConfig.defraId.scope);
  url.searchParams.append("response_type", "code");
  url.searchParams.append("serviceId", config.authConfig.defraId.serviceId);
  url.searchParams.append("state", state.generate(request));
  url.searchParams.append("forceReselection", true);
  if (useProofKeyForCodeExchange) {
    // Used to secure authorization code grants by using Proof Key for Code Exchange (PKCE)
    const codeChallenge = pkce.generateCodeChallenge(session, request);
    url.searchParams.append("code_challenge", codeChallenge);
    url.searchParams.append("code_challenge_method", "S256");
  }
  return url;
};

export default requestAuthorizationCodeUrl;
