import { fileURLToPath } from "url";
import { dirname } from "path";
import Vision from "@hapi/vision";
import Nunjucks from "nunjucks";
import Path from "path";
import Joi from "joi";
import headerData from "./web/helper/constants.js";
import { promises as fs } from 'fs'; // Import fs promises

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
          return (context) => {
            try {
              return template.render(context);
            } catch (error) {
              console.error('Error rendering template:', error);
              return serveStaticErrorPage();
            }
          };
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
    },
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
          path: "./web/assets",
          redirectToSlash: true,
          index: true,
        },
      },
    },
  });

  // Route to get a 500 error
  server.route({
    method: "GET",
    path: "/500error",
    handler: (_request, _h) => {
      return _h.view('errors/500error').takeover();
    },
  });

  async function serveStaticErrorPage() {
    const filePath = Path.join(__dirname, '/web/views/errors/', '500Error.html'); // Use path for cross-platform compatibility
    try {
        // Await the readFile result to ensure it's resolved before returning
        const content = await fs.readFile(filePath, 'utf-8'); 
        return content; // Return the content of the error page
    } catch (fileError) {
        console.error('Error reading static error page:', fileError);
        // Fallback error message if file read fails
        return '<h1>Internal Server Error</h1><p>There was an error rendering the page.</p>';
    }
}


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
