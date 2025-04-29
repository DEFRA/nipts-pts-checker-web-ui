import jwt from "jsonwebtoken";

const decodeJwt = (token) => {
  console.log(
    `${new Date().toISOString()} Decoding JWT token: ${JSON.stringify({
      token: `${token.slice(0, 5)}...${token.slice(-5)}`,
    })}`
  );
  try {
    const decodedToken = jwt.decode(token, { complete: true });
    if (!decodedToken) {
      throw new Error("The token has not been decoded");
    }
    return decodedToken.payload;
  } catch (error) {
    global.appInsightsClient.trackException({ exception: error });
    console.log(
      `${new Date().toISOString()} Error while decoding JWT token: ${
        error.message
      }`
    );
    console.error(error);
    return undefined;
  }
};

export default decodeJwt;
