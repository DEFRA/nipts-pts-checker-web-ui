import currentSailingMainService from "../../../api/services/currentSailingMainService.js";
import { CurrentSailingMainModel } from "../../../api/models/currentSailingMainModel.js";
import CurrentSailingModel from "../../../constants/currentSailingConstant.js";
import httpService from "../../../api/services/httpService.js";

jest.mock("../../../api/services/httpService.js");

const baseUrl =
  process.env.BASE_API_URL || "https://devptswebaw1003.azurewebsites.net/api";

describe("currentSailingMainService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches data successfully and returns CurrentSailingMainModel", async () => {
    const mockData = [
      { id: 1, routeName: "Route 1" },
      { id: 2, routeName: "Route 2" },
    ];

    // Mock axios response
    httpService.getAsync.mockResolvedValue({ data: mockData });

    const result = await currentSailingMainService.getCurrentSailingMain();

    expect(httpService.getAsync).toHaveBeenCalledWith(
      `${baseUrl}/sailing-routes`
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

    const result = await currentSailingMainService.getCurrentSailingMain();

    expect(console.error).toHaveBeenCalledWith(
      "Error fetching data:",
      expect.any(Error)
    );
    expect(result).toBeUndefined();

    consoleSpy.mockRestore();
  });
});
