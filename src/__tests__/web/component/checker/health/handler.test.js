const HTTP_STATUS_OK = 200;
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

import httpService from "../../../../../api/services/httpService.js";
import { HealthHandlers } from "../../../../../web/component/checker/health/handler.js";

jest.mock("../../../../../api/services/httpService.js");

global.appInsightsClient = {
  trackException: jest.fn()
 };

describe("getHealthOne", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return healthy status when authenticated and all checks pass", async () => {
    const mockRequest = {
      auth: { isAuthenticated: true },
    };

    const mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis(),
    };

    httpService.getAsync.mockResolvedValue({ status: HTTP_STATUS_OK });

    await HealthHandlers.getHealth(mockRequest, mockH);

    expect(httpService.getAsync).toHaveBeenCalled();
    expect(mockH.response).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "healthy",
        checks: {
          api: { status: "healthy" },
          database: { status: "healthy" },
        },
      })
    );
    expect(mockH.code).toHaveBeenCalledWith(HTTP_STATUS_OK);
  });

  it("should return not checked api status when not authenticated", async () => {
    const mockRequest = {
      auth: { isAuthenticated: false },
    };

    const mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis(),
    };

    await HealthHandlers.getHealth(mockRequest, mockH);

    expect(httpService.getAsync).not.toHaveBeenCalled();
    expect(mockH.response).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "healthy",
        checks: {
          api: { status: "not checked (no auth)" },
          database: { status: "healthy" },
        },
      })
    );
    expect(mockH.code).toHaveBeenCalledWith(HTTP_STATUS_OK);
  });
});

describe("getHealthTwo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return unhealthy status when API check fails", async () => {
    const mockRequest = {
      auth: { isAuthenticated: true },
    };

    const mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis(),
    };

    httpService.getAsync.mockResolvedValue({
      status: HTTP_STATUS_INTERNAL_SERVER_ERROR,
    });

    await HealthHandlers.getHealth(mockRequest, mockH);

    expect(mockH.response).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "unhealthy",
        checks: {
          api: { status: "unhealthy" },
          database: { status: "healthy" },
        },
      })
    );
    expect(mockH.code).toHaveBeenCalledWith(HTTP_STATUS_INTERNAL_SERVER_ERROR);
  });

  it("should handle errors and return unhealthy status", async () => {
    const mockRequest = {
      auth: { isAuthenticated: true },
    };

    const mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis(),
    };

    httpService.getAsync.mockRejectedValue(new Error("Test error"));

    await HealthHandlers.getHealth(mockRequest, mockH);

    expect(mockH.response).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "unhealthy",
        checks: {
          api: { status: "unhealthy" },
          database: { status: "healthy" },
        },
      })
    );
    expect(mockH.code).toHaveBeenCalledWith(HTTP_STATUS_INTERNAL_SERVER_ERROR);
    expect(global.appInsightsClient.trackException).toHaveBeenCalled();
  });
});
