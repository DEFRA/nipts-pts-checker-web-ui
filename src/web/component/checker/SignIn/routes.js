import Joi from "joi";
import HttpMethod from "../../../../constants/httpMethod.js";
import auth from "../../../../auth/index.js";
import session from "../../../../session/index.js";
import logout from "../../../../lib/logout.js";

const Routes = [
  {
    method: "GET",
    path: "/signin-oidc",
    options: {
      auth: false,
      handler: async (request, h) => {
        console.log("SignIn callback");
        try {
          const authResult = await auth.authenticate(request, h);

          const organisationId = request.yar.get("organisationId");
          if (!organisationId || organisationId.trim() === "") {
            logout(request);
            console.error("Organisation ID missing - Showing 403 error");
            return h.view("errors/403Error").code(403).takeover();
          }

          console.log("Authenticated, now redirecting to Current Sailings");
          return h.redirect("/checker/current-sailings");
        } catch (err) {
          console.error(`Authentication error: ${err.message}`);
          logout(request);

          if (err.statusCode === 403) {
            return h.view("errors/403Error").code(403).takeover();
          }
          return h.view("errors/500Error").code(500).takeover();
        }
      },
    },
  },
];


export default Routes;
