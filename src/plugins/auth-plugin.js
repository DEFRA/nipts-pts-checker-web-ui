import config from "../config/index.js";
import auth from "../auth/index.js";
import session from "../session/index.js";
import sessionKeys from "../session/keys.js";

export default {
  plugin: {
    name: 'auth',
    register: async (server, _) => {
      server.auth.strategy('session', 'cookie', {
        cookie: {
          isSameSite: config.cookie.isSameSite,
          isSecure: config.cookie.isSecure,
          name: config.cookie.cookieNameAuth,
          password: config.cookie.password,
          path: config.cookiePolicy.path,
          ttl: config.cookie.ttl,  // TTL set to 30 minutes or any value defined in config
        },
        keepAlive: true, // Keeps the session alive as long as the user is active
        redirectTo: (request) => {
          return auth.requestAuthorizationCodeUrl(session, request);
        },
        validateFunc: async (request, session) => {
          let result = { valid: false };
      
          // Assuming session has a createdAt timestamp
          if (session && session.createdAt) {
              const currentTime = Date.now();
              const sessionTTL = config.cookie.ttl;  // TTL is 30 minutes in milliseconds
      
              // Check if the session is still within the allowed TTL
              if ((currentTime - session.createdAt) <= sessionTTL) {
                  result.valid = true;
              }
          }
      
          return result;
      },
      });

      server.auth.default({ strategy: 'session', mode: 'required' });

      server.ext('onPreResponse', (request, h) => {
        const response = request.response;
        const ttl = response?.ttl || request?.ttl;

        //alternative is to use !request.auth.isAuthenticated, but this seems to always be false. I attempted 
        // auth: session, but this did not work :(

        if ((response.isBoom && response.output.statusCode === 401) || !validateFunc(ttl)) {
          // Redirect to logout page if session has expired
          return h.redirect('/logout').takeover();
        }

        return h.continue;
      });
    },
  },
};