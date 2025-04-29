import jwt from "jsonwebtoken";
import jwktopem from "jwk-to-pem";
import acquireSigningKey from "./acquire-signing-key.js";

const jwtVerify = async (token) => {
  console.log(
    `${new Date().toISOString()} Verifying JWT token: ${JSON.stringify({
      token: `${token.slice(0, 5)}...${token.slice(-5)}`,
    })}`
  );
  try {
    const jwk = await acquireSigningKey();
    const publicKey = jwktopem(jwk);
    const decoded = await jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
      ignoreNotBefore: true,
    });
    if (!decoded) {
      throw new Error("The token has not been verified");
    }
  } catch (error) {
    global.appInsightsClient.trackException({ exception: error });
    console.log(
      `${new Date().toISOString()} Error while verifying JWT token: ${
        error.message
      }`
    );
    console.error(error);
    throw error;
  }
};

export default jwtVerify;
