"use strict";

import httpService from "../../../../api/services/httpService.js";

async function checkApiHealth(request) {
  try {
    const baseUrl =
      process.env.BASE_API_URL ||
      "https://devptswebaw1003.azurewebsites.net/api";
    const url = `${baseUrl}/health`;
    const response = await httpService.getAsync(url, request);
    return response.status < 400;
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
      : "unknown";
    const isDatabaseHealthy = await checkDatabaseHealth();
    const isHealthy =
      (isApiHealthy === true || isApiHealthy === "unknown") &&
      isDatabaseHealthy;

    const response = {
      status: isHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      checks: {
        api: {
          status:
            isApiHealthy === "unknown"
              ? "not checked (no auth)"
              : isApiHealthy
              ? "healthy"
              : "unhealthy",
        },
        database: {
          status: isDatabaseHealthy ? "healthy" : "unhealthy",
        },
      },
    };

    return h.response(response).code(isHealthy ? 200 : 500);
  } catch (error) {
    console.error("Health check failed with error:", error);
    return h
      .response({
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
      })
      .code(500);
  }
};

export const HealthHandlers = {
  getHealth,
};
