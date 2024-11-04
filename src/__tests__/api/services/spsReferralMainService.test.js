import spsService from "../../../api/services/spsReferralMainService";
import { SpsReferralMainModel } from "../../../api/models/spsReferralMainModel";
import httpService from "../../../api/services/httpService";
import moment from "moment";

jest.mock("../../../api/services/httpService");

describe("GetSpsReferrals", () => {
  const route = "TestRoute";
  const date = "2024-11-05";
  const timeWindowInHours = 2;
  const formattedDate = moment(date).toISOString();
  let request;

  beforeEach(() => {
    // Mock request object with headers
    request = {
      headers: {
        authorization: "Bearer mockToken",
      },
    };
    jest.clearAllMocks();
  });

  it("should fetch data and map it to SpsReferralMainModel", async () => {
    const apiResponse = {
      data: [
        {
          ptdNumber: "12345",
          petDescription: "Dog",
          microchip: "987654321012345",
          travelBy: "Car",
          spsOutcome: "Approved",
        },
        {
          ptdNumber: "67890",
          petDescription: "Cat",
          microchip: "987654321098765",
          travelBy: "Plane",
          spsOutcome: "Pending",
        },
      ],
    };

    httpService.postAsync.mockResolvedValue(apiResponse);

    const expectedData = apiResponse.data.map(
      (item) =>
        new SpsReferralMainModel({
          PTDNumber: item.ptdNumber,
          PetDescription: item.petDescription,
          Microchip: item.microchip,
          TravelBy: item.travelBy,
          SPSOutcome: item.spsOutcome,
        })
    );

    const data = await spsService.GetSpsReferrals(
      route,
      date,
      timeWindowInHours,
      request
    );

    expect(data).toEqual(expectedData);
    expect(httpService.postAsync).toHaveBeenCalledWith(
      expect.stringContaining("/Checker/getSpsCheckDetailsByRoute"),
      { route, SailingDate: formattedDate, timeWindowInHours },
      request // Pass the request object as the third parameter
    );
  });

  it("should return an error if the API returns an error", async () => {
    const apiError = { error: "Not Found" };
    httpService.postAsync.mockResolvedValue(apiError);

    const result = await spsService.GetSpsReferrals(
      route,
      date,
      timeWindowInHours,
      request
    );

    expect(result).toEqual({ error: apiError.error });
    expect(httpService.postAsync).toHaveBeenCalledWith(
      expect.stringContaining("/Checker/getSpsCheckDetailsByRoute"),
      { route, SailingDate: formattedDate, timeWindowInHours },
      request
    );
  });

  it("should throw an error if response data structure is invalid", async () => {
    const apiResponse = { data: "Invalid Data Structure" };
    httpService.postAsync.mockResolvedValue(apiResponse);

    await expect(
      spsService.GetSpsReferrals(route, date, timeWindowInHours, request)
    ).rejects.toThrow("Unexpected response structure");

    expect(httpService.postAsync).toHaveBeenCalledWith(
      expect.stringContaining("/Checker/getSpsCheckDetailsByRoute"),
      { route, SailingDate: formattedDate, timeWindowInHours },
      request
    );
  });

  it("should handle unexpected errors gracefully", async () => {
    httpService.postAsync.mockRejectedValue(new Error("Unexpected error"));

    await expect(
      spsService.GetSpsReferrals(route, date, timeWindowInHours, request)
    ).rejects.toThrow("Unexpected error");

    expect(httpService.postAsync).toHaveBeenCalledWith(
      expect.stringContaining("/Checker/getSpsCheckDetailsByRoute"),
      { route, SailingDate: formattedDate, timeWindowInHours },
      request
    );
  });
});
