import config from "../config/index.js";
import session from "../session/index.js";
import sessionKeys from "../session/keys.js";

export default {
  plugin: {
    name: "magicPassword",
    register: (server, _) => {
      server.ext("onPreResponse", (request, h) => {
        const ignoredPaths = ["/", "/password", "/signin-oidc", "/signout"];
        const currentPath = request.path.toLowerCase();

        const ignore = ignoredPaths.includes(currentPath);
        const isAsset = currentPath.includes("/assets")

        if (!ignore && !isAsset && config.authConfig?.magicPassword?.isEnabled) {
          const password = session.getToken(
            request,
            sessionKeys.tokens.magicPassword
          );

          if (!password || password !== "confirmed") {
            const url = `/password?returnURL=${currentPath}`;
            return h.response().redirect(url);
          }
        }

        return h.continue;
      });
    },
  },
};
