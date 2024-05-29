"use strict";

import Handler from "./handler.js";

const Routes = [
  {
    method: "GET",
    path: "/Checker/CurrentSailing",
    config: Handler.index,
  },
  {
    method: 'POST',
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
      method: 'GET',
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