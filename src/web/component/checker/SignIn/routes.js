"use strict";
import Joi from "joi";
import config from "../../../../config/index.js";
import HttpMethod from "../../../../constants/httpMethod.js";
import auth from "../../../../auth/index.js";
import session from "../../../../session/index.js";
import logout from "../../../../lib/logout.js";

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
          console.error(
            `Received error with name ${err.name} and message ${err.message}.`
          );

          logout(request);

          try {
            if (err.name === "UnauthorizedError" || err.statusCode === 401) {
              console.log("Unauthorized error detected, rendering 401 page");

              const errorData = {
                signOutUrl: config.authConfig.defraId.signOutUrl,
              };

              return h.view("errors/401Error", errorData).code(401).takeover();
            }
            if (err.name === "ForbiddenError" || err.statusCode === 403) {
              console.log("Forbidden error detected, rendering 403 page");
              return h.view("errors/403Error").code(403).takeover();
            }

            console.log("General error, returning basic response");
            return h
              .response("Authentication failed: " + err.message)
              .code(401)
              .takeover();
          } catch (viewError) {
            console.error("Error rendering view:", viewError);

            return h
              .response("Authentication failed. No roles found in token.")
              .code(401)
              .takeover();
          }
        }
      },
    },
  },
];

export default Routes;
