import Joi from "joi";
import  authConfig from "./auth.js";


const minutesToMilliseconds = (minutes) => {
  return (60000 * minutes);
}

// 30 minutes
const timeOutInMilliseconds = minutesToMilliseconds(30);

const schema = Joi.object({
  namespace: Joi.string().optional(),
  cookie: {
    cookieNameCookiePolicy: Joi.string().default("pts_cp_cookie_policy"),
    cookieNameAuth: Joi.string().default("pts_cp_auth"),
    cookieNameSession: Joi.string().default("pts_cp_session"),
    isSameSite: Joi.string().default("Lax"),
    isSecure: Joi.boolean().default(true),
    password: Joi.string().min(32).required(),
    ttl: Joi.number().default(timeOutInMilliseconds), 
  },
  cookiePolicy: {
    clearInvalid: Joi.bool().default(false),
    encoding: Joi.string().valid("base64json").default("base64json"),
    isSameSite: Joi.string().default("Lax"),
    isSecure: Joi.bool().default(true),
    password: Joi.string().min(32).required(),
    path: Joi.string().default("/"),
    ttl: Joi.number().default(timeOutInMilliseconds),  
  },
  env: Joi.string()
    .valid("local","development", "test", "send", "preproduction","production")
    .default("local"),
  isDev: Joi.boolean().default(true),
});

const config = {
  namespace: process.env.NAMESPACE,
  cookie: {
    cookieNameCookiePolicy: "pts_cp_cookie_policy",
    cookieNameAuth: "pts_cp_auth",
    cookieNameSession: "pts_cp_session",
    isSameSite: "Lax",
    isSecure: true,
    password: process.env.COOKIE_PASSWORD || "%dsfdsf98921341203 bn12392832193",
  },
  cookiePolicy: {
    clearInvalid: false,
    encoding: "base64json",
    isSameSite: "Lax",
    isSecure: true,
    password: process.env.COOKIE_PASSWORD || "%dsfdsf98921341203 bn12392832193",
  },
  env: process.env.NODE_ENV,
  isDev: process.env.NODE_ENV === "local" || process.env.NODE_ENV === "development",
};

const result = schema.validate(config, {
  abortEarly: false,
});

if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`);
}

const value = result.value;
authConfig.getAuthConfig()
  .then(cfg => {
    value.authConfig = cfg;
  })
  .catch(error => {
    throw new Error(`The server config is invalid. ${error}`);
  });

export default value;
