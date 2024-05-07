import Hapi from "@hapi/hapi";
import dotenv from "dotenv";

import ConfigServer from "./src/configServer.js";
import pluginList from "./src/helper/plugins.js";

// Load environment variables from .env file
dotenv.config();

// Server configuration
const serverConfig = {
  port: 4000,
  host: "pet-test.azurewebsites.net",
};

// Create a server instance
const server = Hapi.server(serverConfig);

/**
 * Register plugins and configure the server
 */
const init = async () => {
  try {
    // Register plugins
    await server.register(pluginList);

    // Configure the server
    ConfigServer.setup(server);   

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