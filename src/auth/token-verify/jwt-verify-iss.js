import config from "../../config/index.js";

const jwtTrustedIssuers = [
  `https://${config.authConfig.defraId.tenantName}.b2clogin.com/${config.authConfig.defraId.jwtIssuerId}/v2.0/`,
];

const jwtVerifyIss = async (iss) => {
  console.log(`${new Date().toISOString()} Verifying the issuer`);
  try {
    if (!jwtTrustedIssuers.includes(iss)) {
      throw new Error(`Issuer not trusted: ${iss}`);
    }
    return true;
  } catch (error) {
    console.log(
      `${new Date().toISOString()} Error while verifying the issuer: ${
        error.message
      }`
    );
    console.error(error);
    throw error;
  }
};

export default jwtVerifyIss;
