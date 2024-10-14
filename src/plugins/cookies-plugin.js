import config from "../config/index.js";
import cookiesHelper from "../lib/cookies-helper.js";

export default {
  plugin: {
    name: "cookies",
    register: (server, _) => {
      server.state(config.cookie.cookieNameCookiePolicy, config.cookiePolicy);

      server.ext("onPreResponse", (request, h) => {
        const statusCode = request.response.statusCode;
        if (
          request.response.variety === "view" &&
          statusCode !== 404 &&
          statusCode !== 500 &&
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
