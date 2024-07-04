import Hapi from "@hapi/hapi";
import dotenv from "dotenv";
import config from "./src/config/index.js";
import catboxMemory from "@hapi/catbox-memory";
import ConfigServer from "./src/configServer.js";
import pluginList from "./src/helper/plugins.js";

// Load environment variables from .env file
dotenv.config();

// Server configuration
const serverConfig = {
  cache: [
    {
      provider: {
        constructor: catboxMemory.Engine,
        options: {},
      },
    },
  ],
  port: process.env.PORT || 5000,
  host: process.env.HOST || "localhost",
  routes: {
    cors: {
        origin: ['*'],
        headers: ["Accept", 'Authorization', 'Content-Type', 'If-None-Match', 'Accept-language'],
        additionalHeaders: ['cache-control', 'x-requested-with', 'Access-Control-Allow-Origin']
    }
}
};

// Create a server instance
const server = Hapi.server(serverConfig);

const submissionCrumbCache = server.cache({
  expiresIn: 1000 * 60 * 60 * 24,
  segment: "submissionCrumbs",
}); // 24 hours
server.app.submissionCrumbCache = submissionCrumbCache;

/**
 * Register plugins and configure the server
 */
const init = async () => {
  try {
    // Register plugins
    await server.register(pluginList);

    // Configure the server
    ConfigServer.setup(server);

    if (config.isDev) {
      await server.register(require("blipp"));
    }

    server.ext("onPreResponse", (request, h) => {
      const response = request.response;
      
      //response.output.payload.isAuthenticated = request.auth.isAuthenticated;

      return h.continue;
    });

    // Start the server
    await server.start();

    console.log("Server running on %s", server.info.uri);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Initialize the server
init();
