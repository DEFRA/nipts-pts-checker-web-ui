import config from "../config/index.js";
import Yar from "@hapi/yar";

export default {
  plugin: Yar,
  options: {
    name: config.cookie.cookieNameSession,
    maxCookieSize: 1024,
    storeBlank: true,
    cache: {
      cache: config.cache.name,
      expiresIn: config.cache.expiresIn,
    },
    cookieOptions: {
      isHttpOnly: true,
      isSameSite: config.cookie.isSameSite,
      isSecure: config.cookie.isSecure,
      password: config.cookie.password,
      ttl: config.cache.expiresIn,
    },
  },
};
