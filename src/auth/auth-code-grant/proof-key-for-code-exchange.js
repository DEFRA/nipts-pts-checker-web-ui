import crypto from "crypto";
import sessionKeys from "../../session/keys.js";

const base64URLEncode = (str) => {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

const sha256 = (buffer) => {
  return crypto.createHash("sha256").update(buffer).digest();
};

const generateCodeChallenge = (session, request) => {
  const verifier = base64URLEncode(crypto.randomBytes(32));
  const codeChallenge = base64URLEncode(sha256(verifier));
  session.setPkcecodes(request, sessionKeys.pkcecodes.verifier, verifier);
  return codeChallenge;
};

export default { generateCodeChallenge };
