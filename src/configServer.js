import { fileURLToPath } from "url";
import Path, { dirname } from "path";
import Nunjucks from "nunjucks";
import Joi from "joi";
import headerData from "./web/helper/constants.js";
import { promises as fs } from "fs";

const fileName = fileURLToPath(import.meta.url);
const directoryName = dirname(fileName);

const HTTP_STATUS = {
  FORBIDDEN: 403,
  SERVER_ERROR: 500,
  SERVICE_UNAVALABLE: 503,
};

const PATHS = {
  VIEWS: Path.resolve(directoryName, "./web/views"),
  WEB_ASSETS: Path.join(directoryName, "./web/assets"),
  WEB: Path.join(directoryName, "./web"),
};

const ERROR_VIEWS = {
  FORBIDDEN: "errors/403Error",
  SERVER_ERROR: "errors/500Error",
};

const ERROR_ROUTES = {
  SERVER_ERROR: "/500error",
};

const MAINTENANCE_ROUTES = {
  PLANNED: "/plannedMaintenance",
  UNPLANNED: "/unplannedMaintenance",
}

const MAINTENANCE_VIEWS = {
  PLANNED: "maintenance/plannedMaintenance",
  UNPLANNED: "maintenance/unplannedMaintenance",
}

async function serveStaticErrorPage() {
  const filePath = Path.join(PATHS.VIEWS, "errors", "500Error.html");
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch (fileError) {
    return "<h1>Internal Server Error</h1><p>There was an error rendering the page.</p>";
  }
}

const configureViews = (server) => {
  const includesPath = Path.resolve(PATHS.VIEWS, "includes");

  server.views({
    engines: {
      html: {
        compile: (src, options) => {
          const template = Nunjucks.compile(src, options.environment);
          return (context) => {
            try {
              return template.render(context);
            } catch (error) {
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
              PATHS.VIEWS,
              includesPath,
            ],
            { watch: false }
          );
          return next();
        },
      },
    },
    relativeTo: directoryName,
    path: PATHS.VIEWS,
    partialsPath: includesPath,
    context: { headerData },
  });
};

const configureStaticRoutes = (server) => {
  server.route({
    method: "GET",
    path: "/web/assets/{param*}",
    options: {
      auth: false,
      handler: {
        directory: {
          path: PATHS.WEB_ASSETS,
          redirectToSlash: true,
          index: true,
        },
      },
    },
  });

  server.route({
    method: "GET",
    path: "/{param*}",
    options: {
      auth: false,
      handler: {
        directory: {
          path: PATHS.WEB,
        },
      },
    },
  });
};

const configureErrorRoutes = (server) => {
  server.route({
    method: "GET",
    path: ERROR_ROUTES.SERVER_ERROR,
    handler: (_request, h) => {
      return h.view(ERROR_VIEWS.SERVER_ERROR).takeover();
    },
  });
};

const configureMaintenanceRoutes = (server) => {
  server.route({
    method: "GET",
    path: MAINTENANCE_ROUTES.UNPLANNED,
    handler: (_request, h) => {
      return h.view(MAINTENANCE_VIEWS.UNPLANNED).takeover();
    },
  });
  server.route({
    method: "GET",
    path: MAINTENANCE_ROUTES.PLANNED,
    handler: (_request, h) => {
      return h.view(MAINTENANCE_VIEWS.PLANNED, {
        date: 'Thursday 4 April 2024', // need to change
        time: '8pm'
      }).takeover();
    },
  });
};

const setup = (server) => {
  configureViews(server);
  configureStaticRoutes(server);
  configureErrorRoutes(server);
  configureMaintenanceRoutes(server);

  server.validator(Joi);

  server.ext("onPreResponse", (request, h) => {
    const response = request.response;

    if (response.isBoom) {
      if (response.output.statusCode === HTTP_STATUS.SERVER_ERROR) {
        return h
          .view(ERROR_VIEWS.SERVER_ERROR)
          .code(HTTP_STATUS.SERVER_ERROR)
          .takeover();
      }
      if (response.output.statusCode === HTTP_STATUS.FORBIDDEN) {
        return h
          .view(ERROR_VIEWS.FORBIDDEN)
          .code(HTTP_STATUS.FORBIDDEN)
          .takeover();
      }
      if (response.output.statusCode === HTTP_STATUS.SERVICE_UNAVALABLE) {
        return h
          .view(MAINTENANCE_VIEWS.UNPLANNED)
          .code(HTTP_STATUS.SERVICE_UNAVALABLE)
          .takeover();
      }
    }

    return h.continue;
  });
};

export default {
  setup,
};
