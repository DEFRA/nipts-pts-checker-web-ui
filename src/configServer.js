import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Vision from "@hapi/vision";
import Nunjucks from "nunjucks";
import Path from "path";
import Joi from "@hapi/joi";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const setup = (server) => {
  // View configuration
  const viewsPath = Path.resolve(__dirname, "./web/views");

  server.views({
    engines: {
      html: {
        compile: (src, options) => {
          const template = Nunjucks.compile(src, options.environment);
          return (context) => {
            return template.render(context);
          };
        },
        prepare: (options, next) => {
          options.compileOptions.environment = Nunjucks.configure(
            ["node_modules/govuk-frontend/dist", options.path, viewsPath],
            { watch: false }
          );
          return next();
        },
      },
    },
    relativeTo: __dirname,
    path: viewsPath,
    partialsPath: Path.resolve(viewsPath, "partials"),
  });

  server.route({
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: Path.join(__dirname, "./web"),
      },
    },
  });

  // Configure validator
  server.validator(Joi);

  // Add a route to serve static files from the 'assets' directory
  server.route({
    method: "GET",
    path: "/web/assets/{param*}",
    handler: {
      directory: {
        path: "./web/assets", // Update the path to look for the file in the workspace
        redirectToSlash: true,
        index: true,
      },
    },
  });
};

export default {
  setup,
};