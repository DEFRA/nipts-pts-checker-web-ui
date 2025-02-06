"use strict";
import Joi from "joi";
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
          if (err.name) {
            return h.redirect("/checker/current-sailings");
          }
          console.error(
            `Received error with name ${err.name} and message ${err.message}.`
          );
        }

        logout(request);

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
  },
];

export default Routes;
