import { fileURLToPath } from "url";
import { dirname } from "path";
import Vision from "@hapi/vision";
import Nunjucks from "nunjucks";
import Path from "path";
import Joi from "joi";
import headerData from "./web/helper/constants.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const setup = (server) => {
  // View configuration
  const viewsPath = Path.resolve(__dirname, "./web/views");
  const includesPath = Path.resolve(viewsPath, "includes");

  server.views({
    engines: {
      html: {
        compile: (src, options) => {
          const template = Nunjucks.compile(src, options.environment);
          return (context) => template.render(context);
        },
        prepare: (options, next) => {
          options.compileOptions.environment = Nunjucks.configure(
            [
              "node_modules/hmrc-frontend/dist",
              "node_modules/govuk-frontend/dist",
              options.path,
              viewsPath,
              includesPath,
            ],
            { watch: false }
          );
          return next();
        },
      },
    },
    relativeTo: __dirname,
    path: viewsPath,
    partialsPath: includesPath,
    context: { headerData },
  });

  server.route({
    method: "GET",
    path: "/{param*}",
    options: {
      auth: false,
      handler: {
        directory: {
          path: Path.join(__dirname, "./web"),
        },
      },
    }
  });

  // Configure validator
  server.validator(Joi);

  // Add a route to serve static files from the 'assets' directory
  server.route({
    method: "GET",
    path: "/web/assets/{param*}",
    options: {
      auth: false,
      handler: {
        directory: {
          path: "./web/assets", // Update the path to look for the file in the workspace
          redirectToSlash: true,
          index: true,
        },
      },
    }
  });

  // Route to get a 500error
  server.route({
    method: "GET",
    path: "/500error",
    handler: (_request, _h) => {
      return _h.view('errors/500error').code(500).takeover();
    }

  });

  // Global error handling via 'onPreResponse' extension
  server.ext('onPreResponse', (_request, _h) => {
    const response = _request.response;

    // Check if the response is an error (500 level)
    if (response.isBoom && response.output.statusCode === 500) {
      // Render the 500Error.html template
      return _h.redirect('/500error').takeover();
    }

    // If it's not a 500 error, continue as normal
    return _h.continue;
  });

};

export default {
  setup,
};
