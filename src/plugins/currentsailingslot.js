import { CurrentSailingRouteOptions } from "../constants/currentSailingConstant.js";
import session from "../session/index.js";
import sessionKeys from "../session/keys.js";
const VIEW_PATH = "componentViews/checker/currentsailing/currentsailingView";

export default {
    plugin: {
      name: "currentsailingslot",
      register: (server, _) => {
        server.ext('onPreResponse', (request, h) => {

          if (request.response.variety !== 'view') {
            return h.continue;
          }

          const token =   session.getToken(request, sessionKeys.tokens.accessToken);
          if(!token)
          {
            return h.continue;
          }

          const currentSailingSlot = request.yar.get("CurrentSailingSlot");
          const currentPath = request.path;

          // List of paths or files to exclude from this check
          const excludedPaths = [
            '/',
            '/checker/current-sailings',
            '/password', 
            '/500error', 
            '/non-compliance',
            '/timeout'
          ];
          
          const isExcluded = excludedPaths.includes(currentPath);
          // If the current path is excluded skip the check
          if(!isExcluded)
          {

            const currentView = request.response.source.template || 'unknown';

            //sets the context needed for banner in views other than current sailing
            if(VIEW_PATH !== currentView)
            { 
                request.response.source.context = {
                  ...request.response.source.context,
                  currentSailingSlot: currentSailingSlot || null,
                  ROUTE_OPTION_ID: CurrentSailingRouteOptions[0].id,
                };
                       
            
              //if currentSailingSlot is null redirect to sailing-slot page
              //if(currentSailingSlot === null)
              //{              
                //return h.redirect('/checker/current-sailings').takeover();
              //}
            }
          }
          return h.continue;
        });     
      },
    },
};