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
        // Apply headers for all successful responses
        if (!response.isBoom) {
          // Set headers on the response
          headerOptions.forEach(({ key, value }) => {
            response.header(key, value);
          });
        } else {
          // Set headers on error responses (Boom)
          headerOptions.forEach(({ key, value }) => {
            // Set headers on the response output
            response.output.headers[key] = value;
          });
        }
        return h.continue;
      });
    },
  },
};
