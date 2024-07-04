import config from "../config/index.js";
import Crumb from "@hapi/crumb";
export default {
  plugin: Crumb,
  options: {
    cookieOptions: {
      isSecure: config.cookie.isSecure,
    },
    skip: (request) =>
      request.route.path === `${config.urlPrefix}/cookies` &&
      request.method.toLowerCase() === "post",
  },
};
