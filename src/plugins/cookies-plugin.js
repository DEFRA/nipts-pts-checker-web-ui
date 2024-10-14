import config from "../config/index.js";
import cookiesHelper from "../lib/cookies-helper.js";
import HttpStatusConstants from "../../constants/httpMethod.js";

export default {
  plugin: {
    name: "cookies",
    register: (server, _) => {
      server.state(config.cookie.cookieNameCookiePolicy, config.cookiePolicy);

      server.ext("onPreResponse", (request, h) => {
        const statusCode = request.response.statusCode;
        if (
          request.response.variety === "view" &&
          statusCode !==  HttpStatusConstants.NOT_FOUND  &&
          statusCode !==  HttpStatusConstants.INTERNAL_SERVER_ERROR &&
          request.response.source.manager._context
        ) {
          const cookiesPolicy = cookiesHelper.getCurrentPolicy(request, h);
          request.response.source.manager._context.cookiesPolicy = cookiesPolicy;
        }

        return h.continue;
      });
    },
  },
};
