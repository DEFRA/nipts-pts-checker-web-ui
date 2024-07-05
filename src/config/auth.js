import Joi from "joi";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

if (process.env.CP_ENV === "local" && !process.env.DEFRA_ID_CLIENT_ID) {
  dotenv.config({ path: './.env.local', override: true});
}

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

const authConfig = {
  defraId: {
    hostname: `https://${process.env.DEFRA_ID_TENANT}.b2clogin.com/${process.env.DEFRA_ID_TENANT}.onmicrosoft.com`,
    oAuthAuthorisePath: "/oauth2/v2.0/authorize",
    policy: process.env.DEFRA_ID_POLICY,
    redirectUri: process.env.DEFRA_ID_REDIRECT_URI,
    tenantName: process.env.DEFRA_ID_TENANT,
    clientId: process.env.DEFRA_ID_CLIENT_ID,
    clientSecret: process.env.DEFRA_ID_CLIENT_SECRET,
    jwtIssuerId: process.env.DEFRA_ID_JWT_ISSUER_ID || "",
    serviceId: process.env.DEFRA_ID_SERVICE_ID,
    scope: `openid ${process.env.DEFRA_ID_CLIENT_ID} offline_access`,
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
