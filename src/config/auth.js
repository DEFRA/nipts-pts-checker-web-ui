import Joi from "joi";
import dotenv from "dotenv";
import getSecretValue from "../api/services/keyvaultService.js";

// Load environment variables from .env file
dotenv.config();

if (process.env.NODE_ENV === "local" && !process.env.DEFRA_ID_CLIENT_ID) {
  dotenv.config({ path: "./.env.local", override: true });
}

const getConfigValue = async (envValue, secretKey) => {
  if (!envValue || envValue === "") {
    const kvValue = await getSecretValue(secretKey);
    return kvValue;
  }

  return envValue;
};

const authSchema = Joi.object({
  defraId: {
    hostname: Joi.string().uri(),
    oAuthAuthorisePath: Joi.string(),
    policy: Joi.string(),
    redirectUri: Joi.string().uri(),
    tenantName: Joi.string(),
    clientId: Joi.string(),
    clientSecret: Joi.string(),
    jwtIssuerId: Joi.string().allow(null, ""),
    serviceId: Joi.string(),
    scope: Joi.string(),
    signOutUrl: Joi.string(),
  },
});

const tenantName = await getConfigValue(process.env.DEFRA_ID_TENANT, "PTS-CP-B2C-TENANT");
const policy = await getConfigValue(process.env.DEFRA_ID_POLICY, "PTS-CP-B2C-POLICY");
const clientId = await getConfigValue(process.env.DEFRA_ID_CLIENT_ID, "PTS-CP-B2C-CLIENT-ID");
const clientSecret = await getConfigValue(process.env.DEFRA_ID_CLIENT_SECRET, "PTS-CP-B2C-CLIENT-SECRET");
const serviceId = await getConfigValue(process.env.DEFRA_ID_SERVICE_ID, "PTS-CP-B2C-SERVICE-ID");

const authConfig = {
  defraId: {
    hostname: `https://${tenantName}.b2clogin.com/${tenantName}.onmicrosoft.com`,
    oAuthAuthorisePath: "/oauth2/v2.0/authorize",
    policy: policy,
    redirectUri: process.env.DEFRA_ID_REDIRECT_URI,
    tenantName: tenantName,
    clientId: clientId,
    clientSecret: clientSecret,
    jwtIssuerId: process.env.DEFRA_ID_JWT_ISSUER_ID || "",
    serviceId: serviceId,
    scope: `openid ${clientId} offline_access`,
    signOutUrl: process.env.DEFRA_ID_SIGNOUT_URI,
  },
};

const authResult = authSchema.validate(authConfig, {
  abortEarly: false,
});

if (authResult.error) {
  console.log(authResult.error.message);
  throw new Error(`The auth config is invalid. ${authResult.error.message}`);
}

export default authResult.value;
