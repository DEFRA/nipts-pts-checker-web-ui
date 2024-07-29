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
        // Check if response is a Hapi response object
        if (response && response.isBoom === undefined) {
           headerOptions?.forEach((x) => {
              response.header(x.key, x.value);
           });
        }
        return h.continue;
      });
    },
  },
};
