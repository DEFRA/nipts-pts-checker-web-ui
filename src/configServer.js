import { fileURLToPath } from "url";
import Path, { dirname } from "path";
import Nunjucks from "nunjucks";
import Joi from "joi";
import headerData from "./web/helper/constants.js";
import { promises as fs } from "fs";

const fileName = fileURLToPath(import.meta.url);
const directoryName = dirname(fileName);

const HTTP_STATUS = {
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  SERVER_ERROR: 500,
};

const PATHS = {
  VIEWS: Path.resolve(directoryName, "./web/views"),
  WEB_ASSETS: Path.join(directoryName, "./web/assets"),
  WEB: Path.join(directoryName, "./web"),
};

const ERROR_VIEWS = {
  NOT_FOUND: "errors/404Error",
  UNAUTHORIZED: "errors/401Error",
  FORBIDDEN: "errors/403Error",
  SERVER_ERROR: "errors/500Error",
};

const ERROR_ROUTES = {
  SERVER_ERROR: "/500error",
  NOT_FOUND: "/404error",
  UNAUTHORIZED: "/401error",
};

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

  server.route({
    method: "*",
    path: "/{any*}",
    handler: function (_request, h) {
      return h
        .view(ERROR_VIEWS.NOT_FOUND, {
          isAuthorized: _request.yar.get("isAuthorized"),
        })
        .code(HTTP_STATUS.NOT_FOUND)
        .takeover();
    },
  });
};

const configureErrorRoutes = (server) => {
  server.route({
    method: "GET",
    path: ERROR_ROUTES.SERVER_ERROR,
    options: {
      auth: false,
    },
    handler: (_request, h) => {
      return h.view(ERROR_VIEWS.SERVER_ERROR).takeover();
    },
  });

  server.route({
    method: "GET",
    path: ERROR_ROUTES.NOT_FOUND,
    options: {
      auth: false,
    },
    handler: (_request, h) => {
      return h
        .view(ERROR_VIEWS.NOT_FOUND, {
          isAuthorized: _request.yar.get("isAuthorized"),
        })
        .code(HTTP_STATUS.NOT_FOUND)
        .takeover();
    },
  });

  server.route({
    method: "GET",
    path: ERROR_ROUTES.UNAUTHORIZED,
    options: {
      auth: false,
    },
    handler: (_request, h) => {
      return h
        .view(ERROR_VIEWS.UNAUTHORIZED)
        .code(HTTP_STATUS.UNAUTHORIZED)
        .takeover();
    },
  });
};

const setup = (server) => {
  configureViews(server);
  configureStaticRoutes(server);
  configureErrorRoutes(server);

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
      if (response.output.statusCode === HTTP_STATUS.UNAUTHORIZED) {
        return h
          .view(ERROR_VIEWS.UNAUTHORIZED)
          .code(HTTP_STATUS.UNAUTHORIZED)
          .takeover();
      }
      if (response.output.statusCode === HTTP_STATUS.NOT_FOUND) {
        return h
          .view(ERROR_VIEWS.NOT_FOUND, {
            isAuthorized: request.yar.get("isAuthorized"),
          })
          .code(HTTP_STATUS.NOT_FOUND)
          .takeover();
      }
    }

    return h.continue;
  });
};

export default {
  setup,
};
