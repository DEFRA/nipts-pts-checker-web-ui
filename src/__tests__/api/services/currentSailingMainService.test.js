import currentSailingMainService from "../../../api/services/currentSailingMainService.js";
import { CurrentSailingMainModel } from "../../../api/models/currentSailingMainModel.js";
import CurrentSailingModel from "../../../constants/currentSailingConstant.js";
import httpService from "../../../api/services/httpService.js";

jest.mock("../../../api/services/httpService.js");

const baseUrl =
  process.env.BASE_API_URL || "https://devptswebaw1003.azurewebsites.net/api";

  
global.appInsightsClient = {
   trackException: jest.fn()
  };
  

describe("currentSailingMainService", () => {
  let request;

  beforeEach(() => {
    jest.clearAllMocks();
    request = {
      // Mock request object
      headers: {
        authorization: "Bearer mockToken",
      },
    };
  });

  it("Thorows error when the response has status 400", async () => {
    const mockData = undefined;

    // Mock axios response
    httpService.getAsync.mockResolvedValue({ status: 400, data: mockData });

    await expect(currentSailingMainService.getCurrentSailingMain(request))
    .rejects
    .toThrow("API Error: 400");

    expect(httpService.getAsync).toHaveBeenCalledWith(
      `${baseUrl}/sailing-routes`,
      request
    );

    expect(global.appInsightsClient.trackException).toHaveBeenCalled();

  });

  it("Thorows error when the response has status 403", async () => {
    const mockData = null;

    // Mock axios response
    httpService.getAsync.mockResolvedValue({ status: 403, data: mockData });

    await expect(currentSailingMainService.getCurrentSailingMain(request))
    .rejects
    .toThrow("API Error: 403");

    expect(httpService.getAsync).toHaveBeenCalledWith(
      `${baseUrl}/sailing-routes`,
      request
    );
  });

  it("Thorows error when the response has status 500", async () => {
    const mockData = null;

    // Mock axios response
    httpService.getAsync.mockResolvedValue({ status: 500, data: mockData });

    await expect(currentSailingMainService.getCurrentSailingMain(request))
    .rejects
    .toThrow("API Error: 500");

    expect(httpService.getAsync).toHaveBeenCalledWith(
      `${baseUrl}/sailing-routes`,
      request
    );
  });

  it("fetches data successfully and returns CurrentSailingMainModel", async () => {
    const mockData = [
      { id: 1, routeName: "Route 1" },
      { id: 2, routeName: "Route 2" },
    ];

    // Mock axios response
    httpService.getAsync.mockResolvedValue({ status: 200, data: mockData });

    const result = await currentSailingMainService.getCurrentSailingMain(
      request
    );

    expect(httpService.getAsync).toHaveBeenCalledWith(
      `${baseUrl}/sailing-routes`,
      request
    );
    expect(CurrentSailingModel.currentSailingMainModelData.routes).toEqual([
      { id: "1", value: "Route 1", label: "Route 1" },
      { id: "2", value: "Route 2", label: "Route 2" },
    ]);
    expect(result).toBeInstanceOf(CurrentSailingMainModel);
  });



  it("handles errors correctly", async () => {
    httpService.getAsync.mockRejectedValue(new Error("Network Error"));

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

      await expect(currentSailingMainService.getCurrentSailingMain(request))
      .rejects
      .toThrow("Network Error");

    expect(console.error).toHaveBeenCalledWith(
      "Error fetching data:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
