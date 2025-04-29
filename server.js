import Hapi from "@hapi/hapi";
import dotenv from "dotenv";
import config from "./src/config/index.js";
import catboxMemory from "@hapi/catbox-memory";
import ConfigServer from "./src/configServer.js";
import pluginList from "./src/helper/pluginList.js";
import blip from "blipp";
import appInsights from 'applicationinsights';


// Load environment variables from .env file
if (process.env.NODE_ENV === "local" && !process.env.DEFRA_ID_CLIENT_ID) {
  dotenv.config({ path: "./.env.local", override: true });
}


// Initialize Application Insights
const connectionString = process.env.DEV_APPLICATIONINSIGHTS_CONNECTION_STRING;
if (connectionString) {
  appInsights.setup(connectionString)
  .setAutoCollectRequests(true)
  .setAutoCollectPerformance(true)
  .setAutoCollectExceptions(true)
  .start();
const client = appInsights.defaultClient;
 // Make the client available globally
 global.appInsightsClient = client;
} else {
 console.error('APPLICATIONINSIGHTS_CONNECTION_STRING is not set');
}


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
      origin: ["*"], // Allow all origins
      additionalHeaders: ["*"], // Allow all headers
      additionalExposedHeaders: ["*"], // Expose all headers
      credentials: true, // Allow credentials (cookies, etc.)
    },
  },
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
      await server.register(blip);
    }

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
