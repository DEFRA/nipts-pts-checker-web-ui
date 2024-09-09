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
        return h.continue;
      });
    },
  },
};
