import config from "../config/index.js";
import session from "../session/index.js";
import sessionKeys from "../session/keys.js";

export default {
  plugin: {
    name: "magicPassword",
    register: (server, _) => {
      server.ext("onPreResponse", (request, h) => {
        const ignoredPaths = ["/", "/password", "/signin-oidc", "/signout", "/account", "/timeout" ];
        const currentPath = request.path.toLowerCase();

        const ignore = ignoredPaths.includes(currentPath);
        const isAsset = currentPath.includes("/assets")
        const requireMagicPassword = config.authConfig?.magicPassword?.isEnabled === true || 
                                     config.authConfig?.magicPassword?.isEnabled === 'Yes' ||
                                     config.authConfig?.magicPassword?.isEnabled === 'yes'; 

        if (!ignore && !isAsset && requireMagicPassword) {
          const confirmed = session.getToken(
            request,
            sessionKeys.tokens.magicPassword
          );

          if (!confirmed || confirmed !== "confirmed") {
            const url = `/password?returnURL=${currentPath}`;
            return h.response().redirect(url);
          }
        }

        return h.continue;
      });
    },
  },
};
