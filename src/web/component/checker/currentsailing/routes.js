"use strict";

import Handler from "./handler.js";
import  HttpMethod  from "../../../../constants/httpMethod.js";

const Routes = [
  {
    method: HttpMethod.GET,
    path: "/Checker/CurrentSailing",
    config: Handler.index,
  },
  {
    method: HttpMethod.POST,
    path: '/sailing-slot',
    options: {
      handler: (request, h) => {
        // Handle the form submission here
        // The form data is available in request.payload
        const  currentSailingSlot  = request.payload;
        request.yar.set('CurrentSailingSlot', currentSailingSlot);

        return h.redirect('/'); // Redirect to home page after handling the form submission
      }
    }
  },
  {
      method: HttpMethod.GET,
      path: '/sailing-slot',
      options: {
        handler: (request, h) => {
          const currentSailingSlot = request.yar.get('CurrentSailingSlot');
          return h.response({ message: 'Retrieved Current sailing slot', currentSailingSlot });
        }
      }
  }
];

export default Routes;