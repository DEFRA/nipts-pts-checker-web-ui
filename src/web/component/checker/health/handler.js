"use strict";

import httpService from "../../../../api/services/httpService.js";

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;
const HTTP_STATUS_BAD_REQUEST_THRESHOLD = 400;

const API_STATUS_UNKNOWN = "not checked (no auth)";
const API_STATUS_HEALTHY = "healthy";
const API_STATUS_UNHEALTHY = "unhealthy";

async function checkApiHealth(request) {
  try {
    const baseUrl =
      process.env.BASE_API_URL ||
      "https://devptswebaw1003.azurewebsites.net/api";
    const url = `${baseUrl}/health`;
    const response = await httpService.getAsync(url, request);
    return response.status < HTTP_STATUS_BAD_REQUEST_THRESHOLD;
  } catch (error) {
    console.error("API health check failed:", error);
    return false;
  }
}

async function checkDatabaseHealth() {
  return true;
}

const getHealth = async (request, h) => {
  try {
    const isAuthenticated = request.auth?.isAuthenticated;

    const isApiHealthy = isAuthenticated
      ? await checkApiHealth(request)
      : API_STATUS_UNKNOWN;

    const isDatabaseHealthy = await checkDatabaseHealth();

    // Extracted nested ternary operation
    let apiStatus;
    if (isApiHealthy === API_STATUS_UNKNOWN) {
      apiStatus = API_STATUS_UNKNOWN;
    } else {
      apiStatus = isApiHealthy ? API_STATUS_HEALTHY : API_STATUS_UNHEALTHY;
    }

    const databaseStatus = isDatabaseHealthy
      ? API_STATUS_HEALTHY
      : API_STATUS_UNHEALTHY;

    const isHealthy =
      (isApiHealthy === true || isApiHealthy === API_STATUS_UNKNOWN) &&
      isDatabaseHealthy;

    const response = {
      status: isHealthy ? API_STATUS_HEALTHY : API_STATUS_UNHEALTHY,
      timestamp: new Date().toISOString(),
      checks: {
        api: {
          status: apiStatus,
        },
        database: {
          status: databaseStatus,
        },
      },
    };

    return h
      .response(response)
      .code(isHealthy ? HTTP_STATUS_OK : HTTP_STATUS_INTERNAL_SERVER_ERROR);
  } catch (error) {
    console.error("Health check failed with error:", error);
    return h
      .response({
        status: API_STATUS_UNHEALTHY,
        timestamp: new Date().toISOString(),
        error: "Health check failed",
      })
      .code(HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }
};

export const HealthHandlers = {
  getHealth,
};
