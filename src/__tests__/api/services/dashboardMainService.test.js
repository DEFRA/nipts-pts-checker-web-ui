import service from "../../../api/services/dashboardMainService.js";
import httpService from "../../../api/services/httpService.js";
import { DashboardMainModel } from "../../../api/models/dashboardMainModel.js";

jest.mock("../../../api/services/httpService.js");

const baseUrl =
  process.env.BASE_API_URL || "https://devptswebaw1003.azurewebsites.net/api";

describe("service.getCheckOutcomes", () => {
  let request;

  beforeEach(() => {
    jest.clearAllMocks();
    request = {
      headers: {
        authorization: "Bearer mockToken",
      },
    };
  });

  it("should return transformed data when response is valid", async () => {
    const mockResponse = {
      data: [
        {
          routeId: "1",
          routeName: "Route A",
          operatorName: "Operator 1",
          departurePort: "Port A",
          arrivalPort: "Port B",
          departureDate: "2023-01-01",
          departureTime: "10:00",
          passCount: 10,
          failCount: 2,
          failReason: "Delay",
          viewDetailsLink: "http://detailslink.com",
        },
        {
          routeId: "2",
          routeName: "Route B",
          operatorName: "Operator 2",
          departurePort: "Port C",
          arrivalPort: "Port D",
          departureDate: "2023-01-02",
          departureTime: "15:00",
          passCount: 20,
          failCount: 3,
          failReason: "Weather",
          viewDetailsLink: "http://detailslink.com",
        },
      ],
    };

    httpService.postAsync.mockResolvedValue(mockResponse);

    const result = await service.getCheckOutcomes("08:00", "18:00", request);

    expect(httpService.postAsync).toHaveBeenCalledWith(
      `${baseUrl}/Checker/getCheckOutcomes`,
      { startHour: "08:00", endHour: "18:00" },
      request
    );

    const expectedResult = mockResponse.data.map(
      (item) =>
        new DashboardMainModel({
          routeId: item.routeId,
          routeName: item.routeName,
          operatorName: item.operatorName,
          departurePort: item.departurePort,
          arrivalPort: item.arrivalPort,
          departureDate: item.departureDate,
          departureTime: item.departureTime,
          passCount: item.passCount,
          failCount: item.failCount,
          failReason: item.failReason,
          viewDetailsLink: item.viewDetailsLink,
        })
    );

    expect(result).toEqual(expectedResult);
  });

  it("should handle response with an error field", async () => {
    const mockResponse = {
      error: "Some error occurred",
    };

    httpService.postAsync.mockResolvedValue(mockResponse);

    const result = await service.getCheckOutcomes("08:00", "18:00", request);

    expect(result).toEqual({ error: mockResponse.error });
  });

  it("should throw an error for unexpected response structure", async () => {
    const mockResponse = {
      data: { invalid: "data" },
    };

    httpService.postAsync.mockResolvedValue(mockResponse);

    await expect(
      service.getCheckOutcomes("08:00", "18:00", request)
    ).rejects.toThrow("Unexpected response structure");
  });

  it("should throw an error when httpService fails", async () => {
    const error = new Error("Network error");
    httpService.postAsync.mockRejectedValue(error);

    await expect(
      service.getCheckOutcomes("08:00", "18:00", request)
    ).rejects.toThrow("Network error");
  });
});
