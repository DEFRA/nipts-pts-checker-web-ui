import { v4 as uuidv4 } from "uuid";
import session from "../../session/index.js";
import sessionKeys from "../../session/keys.js";

const generate = (request) => {
  const nonce = uuidv4();
  session.setToken(request, sessionKeys.tokens.nonce, nonce);
  return nonce;
};

const verify = (request, idToken) => {
  console.log(`${new Date().toISOString()} Verifying id_token nonce`);
  try {
    if (typeof idToken === "undefined") {
      throw new Error("Empty id_token");
    }
    const nonce = session.getToken(request, sessionKeys.tokens.nonce);
    if (!nonce) {
      throw new Error("HTTP Session contains no nonce");
    }
    if (nonce !== idToken.nonce) {
      throw new Error("Nonce mismatch");
    }
  } catch (error) {
    console.log(
      `${new Date().toISOString()} Error while verifying id_token nonce: ${
        error.message
      }`
    );
    console.error(error);
    throw error;
  }
};

export default { generate, verify };
