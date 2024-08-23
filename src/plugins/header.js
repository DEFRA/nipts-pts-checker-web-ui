import { CurrentSailingRouteOptions } from "../constants/currentSailingConstant.js";
const headerOptions = [
  {
    key: "Cache-Control",
    value: "private, no-cache, no-store, must-revalidate",
  },
  { key: "Expires", value: "-1" },
  { key: "Pragma", value: "no-cache" },
];

export default {
  plugin: {
    name: "header",
    register: (server, _) => {
      server.ext("onPreResponse", (request, h) => {
        const response = request.response;
        if (response.isBoom) {
          // Error response, set headers appropriately
          headerOptions?.forEach((x) => {
            response.output.headers[x.key] = x.value;
          });
        } else if (response.variety === 'plain') {
          // Normal response, set headers appropriately
          headerOptions?.forEach((x) => {
            response.header(x.key, x.value);
          });
        }

        if (request.response.variety === 'view') {
          const currentSailingSlot = request.yar.get("CurrentSailingSlot");
          const currentPath = request.path;
          if(currentPath !== "/" &&
            currentPath !== "/checker/current-sailings")
          {
              request.response.source.context = {
                  ...request.response.source.context,
                  currentSailingSlot: currentSailingSlot || null,
                  ROUTE_OPTION_ID: CurrentSailingRouteOptions[0].id,
              };
          }
        }

        return h.continue;
      });
    },
  },
};
