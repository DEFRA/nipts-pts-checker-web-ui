"use strict";
import Joi from "joi";
import HttpMethod from "../../../../constants/httpMethod.js";
import HttpStatusConstants from "../../../../constants/httpMethod.js";

import auth from "../../../../auth/index.js";
import session from "../../../../session/index.js";
import logout from "../../../../lib/logout.js";

const VIEW_PATH = "componentViews/checker/SignIn/view";

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
          const loginSource = request?.query?.state
            ? JSON.parse(
                Buffer.from(request.query.state, "base64").toString("ascii")
              ).source
            : undefined;

          const vm = {
            backLink: auth.requestAuthorizationCodeUrl(
              session,
              request,
              loginSource
            ),
          };
          return h
            .view(VIEW_PATH, vm)
            .code(HHttpStatusConstants.BAD_REQUEST)
            .takeover();
        },
      },
      handler: async (request, h) => {
        console.log("SignIn callback");
        try {
          //await crumbCache.generateNewCrumb(request, h);
          await auth.authenticate(request, session);
          console.log("authenticated, now redirecting to dashboard");
          return h.redirect("/checker/dashboard");
        } catch (err) {
          if (err.name) {
            return h.redirect("/checker/dashboard");
          }
          console.error(
            `Received error with name ${err.name} and message ${err.message}.`
          );
        }

        logout(request);

        const loginSource = request?.query?.state
          ? JSON.parse(
              Buffer.from(request.query.state, "base64").toString("ascii")
            ).source
          : undefined;

        const vm = {
          backLink: auth.requestAuthorizationCodeUrl(
            session,
            request,
            loginSource
          ),
        };

        return h
          .view(VIEW_PATH, vm)
          .code(HttpStatusConstants.BAD_REQUEST)
          .takeover();
      },
    },
  },
];

export default Routes;