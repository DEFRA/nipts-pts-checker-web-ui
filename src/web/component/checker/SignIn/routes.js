import auth from "../../../../auth/index.js";
import logout from "../../../../lib/logout.js";

const HTTP_STATUS = {
  FORBIDDEN: 403,
  SERVER_ERROR: 500,
};

const ERROR_VIEWS = {
  FORBIDDEN: "errors/403Error",
  SERVER_ERROR: "errors/500Error",
};

const REDIRECT_PATHS = {
  CURRENT_SAILINGS: "/checker/current-sailings",
};

const Routes = [
  {
    method: "GET",
    path: "/signin-oidc",
    options: {
      auth: false,
      handler: async (request, h) => {
        try {
          await auth.authenticate(request, h);

          const organisationId = request.yar.get("organisationId");
          if (!organisationId?.trim()) {
            logout(request);
            return h
              .view(ERROR_VIEWS.FORBIDDEN)
              .code(HTTP_STATUS.FORBIDDEN)
              .takeover();
          }

          return h.redirect(REDIRECT_PATHS.CURRENT_SAILINGS);
        } catch (err) {
          logout(request);

          if (err.statusCode === HTTP_STATUS.FORBIDDEN) {
            return h
              .view(ERROR_VIEWS.FORBIDDEN)
              .code(HTTP_STATUS.FORBIDDEN)
              .takeover();
          }
          return h
            .view(ERROR_VIEWS.SERVER_ERROR)
            .code(HTTP_STATUS.SERVER_ERROR)
            .takeover();
        }
      },
    },
  },
];

export default Routes;
