import Joi from "joi";
import authConfig from "./auth.js";

const schema = Joi.object({
  namespace: Joi.string().optional(),
  cache: {
    expiresIn: Joi.number().default(1000 * 3600 * 24 * 3), // 3 days
    options: {
      host: Joi.string().default("redis-hostname.default"),
      partition: Joi.string().default("pts-compliance-portal"),
      password: Joi.string().allow(""),
      port: Joi.number().default(6379),
      tls: Joi.object(),
    },
  },
  cookie: {
    cookieNameCookiePolicy: Joi.string().default("pts_cp_cookie_policy"),
    cookieNameAuth: Joi.string().default("pts_cp_auth"),
    cookieNameSession: Joi.string().default("pts_cp_session"),
    isSameSite: Joi.string().default("Lax"),
    isSecure: Joi.boolean().default(false),
    password: Joi.string().min(32).required(),
    ttl: Joi.number().default(1000 * 3600 * 24 * 3), // 3 days
  },
  cookiePolicy: {
    clearInvalid: Joi.bool().default(false),
    encoding: Joi.string().valid("base64json").default("base64json"),
    isSameSite: Joi.string().default("Lax"),
    isSecure: Joi.bool().default(true),
    password: Joi.string().min(32).required(),
    path: Joi.string().default("/"),
    ttl: Joi.number().default(1000 * 60 * 60 * 24 * 365), // 1 year
  },
  env: Joi.string()
    .valid("development", "test", "production")
    .default("development"),
  isDev: Joi.boolean().default(true),
  wreckHttp: {
    timeoutMilliseconds: Joi.number().default(10000),
  },
});

const config = {
  namespace: process.env.NAMESPACE,
  cache: {
    options: {
      host: process.env.REDIS_HOSTNAME,
      password: process.env.REDIS_PASSWORD || "",
      port: process.env.REDIS_PORT,
      tls: process.env.NODE_ENV === "production" ? {} : undefined,
    },
  },
  cookie: {
    cookieNameCookiePolicy: "pts_cp_cookie_policy",
    cookieNameAuth: "pts_cp_auth",
    cookieNameSession: "pts_cp_session",
    isSameSite: "Lax",
    isSecure: process.env.NODE_ENV === "production",
    password: process.env.COOKIE_PASSWORD || "%dsfdsf98921341203 bn12392832193",
  },
  cookiePolicy: {
    clearInvalid: false,
    encoding: "base64json",
    isSameSite: "Lax",
    isSecure: process.env.NODE_ENV === "production",
    password: process.env.COOKIE_PASSWORD || "%dsfdsf98921341203 bn12392832193",
  },
  env: process.env.NODE_ENV,
  isDev: process.env.NODE_ENV === "development",
  wreckHttp: {
    timeoutMilliseconds: process.env.WRECK_HTTP_TIMEOUT_MILLISECONDS || 0,
  },
};

const result = schema.validate(config, {
  abortEarly: false,
});

if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`);
}

const value = result.value;
value.authConfig = authConfig;

export default value;
