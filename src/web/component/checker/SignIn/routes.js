"use strict";
import Joi from "joi";
import config from "../../../../config/index.js";
import HttpMethod from "../../../../constants/httpMethod.js";
import auth from "../../../../auth/index.js";
import session from "../../../../session/index.js";
import logout from "../../../../lib/logout.js";

const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  BAD_REQUEST: 400,
};

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/signin-oidc",
    options: {
      auth: false,
      validate: {
        query: Joi.object({
          code: Joi.string().required(),
          state: Joi.string().required(),
        }).options({
          stripUnknown: true,
        }),
        failAction(request, h, err) {
          console.log(
            `Validation error caught during DEFRA ID redirect - ${err.message}.`
          );

          const vm = {
            backLink: auth.requestAuthorizationCodeUrl(
              session,
              request,
              "PTSCompliancePortal"
            ),
          };
          return h
            .view("componentViews/checker/SignIn/view", vm)
            .code(HttpMethod.BAD_REQUEST)
            .takeover();
        },
      },

      handler: async (request, h) => {
        console.log("SignIn callback");
        try {
          await auth.authenticate(request, session);
          console.log("authenticated, now redirecting to dashboard");
          return h.redirect("/checker/current-sailings");
        } catch (err) {
          global.appInsightsClient.trackException({ exception: err });
          console.error(
            `Received error with name ${err.name} and message ${err.message}.`
          );

          request.cookieAuth.clear();
          h.unstate("sessionCreationTime");
          logout(request);

          try {
            if (
              err.name === "UnauthorizedError" ||
              err.statusCode === HTTP_STATUS.UNAUTHORIZED
            ) {
              console.log("Unauthorized error detected, rendering 401 page");

              const errorData = {
                signOutUrl: config.authConfig.defraId.signOutUrl,
              };

              return h
                .view("errors/401Error", errorData)
                .code(HTTP_STATUS.UNAUTHORIZED)
                .takeover();
            }
            if (
              err.name === "ForbiddenError" ||
              err.statusCode === HTTP_STATUS.FORBIDDEN
            ) {
              console.log("Forbidden error detected, rendering 403 page");
              return h
                .view("errors/403Error")
                .code(HTTP_STATUS.FORBIDDEN)
                .takeover();
            }

            console.log("General error, returning basic response");
            return h
              .response("Authentication failed: " + err.message)
              .view("errors/401Error", errorData)
              .code(HTTP_STATUS.UNAUTHORIZED)
              .takeover();
          } catch (viewError) {
            global.appInsightsClient.trackException({ exception: viewError });
            console.error("Error rendering view:", viewError);

            return h
              .response("Authentication failed. No roles found in token.")
              .view("errors/401Error", errorData)
              .code(HTTP_STATUS.UNAUTHORIZED)
              .takeover();
          }
        }
      },
    },
  },
];

export default Routes;
