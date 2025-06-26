import spsService from "../../../api/services/spsReferralMainService";
import { SpsReferralMainModel } from "../../../api/models/spsReferralMainModel";
import httpService from "../../../api/services/httpService";
import moment from "moment";

jest.mock("../../../api/services/httpService");

const routeToValidate = "/Checker/getSpsCheckDetailsByRoute";
const unexpectedError = "Unexpected error";
const getCompleteCheckDetails = "/Checker/getCompleteCheckDetails";

describe("getSpsReferrals", () => {
  const route = "TestRoute";
  const date = "2024-11-05";
  const timeWindowInHours = 2;
  const formattedDate = moment(date).toISOString();
  let request;

  global.appInsightsClient = {
    trackException: jest.fn()
  };


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
          checkSummaryId: "9245A7BB-F2A4-4BD7-AD9F-08DC32FA7B20",
        },
        {
          ptdNumber: "67890",
          petDescription: "Cat",
          microchip: "987654321098765",
          travelBy: "Plane",
          spsOutcome: "Pending",
          checkSummaryId: "9245A7BB-F2A4-4BD7-AD9F-08DC32FA7B20",
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
          CheckSummaryId: item.checkSummaryId,
        })
    );

    const data = await spsService.getSpsReferrals(
      route,
      date,
      timeWindowInHours,
      request
    );

    expect(data).toEqual(expectedData);
    expect(httpService.postAsync).toHaveBeenCalledWith(
      expect.stringContaining(routeToValidate),
      { route, SailingDate: formattedDate, timeWindowInHours },
      request // Pass the request object as the third parameter
    );
  });

  it("should return an error if the API returns an error", async () => {
    const apiError = { error: "Not Found" };
    httpService.postAsync.mockResolvedValue(apiError);

    const result = await spsService.getSpsReferrals(
      route,
      date,
      timeWindowInHours,
      request
    );

    expect(result).toEqual({ error: apiError.error });
    expect(httpService.postAsync).toHaveBeenCalledWith(
      expect.stringContaining(routeToValidate),
      { route, SailingDate: formattedDate, timeWindowInHours },
      request
    );
  });

  it("should throw an error if response data structure is invalid", async () => {
    const apiResponse = { data: "Invalid Data Structure" };
    httpService.postAsync.mockResolvedValue(apiResponse);

    await expect(
      spsService.getSpsReferrals(route, date, timeWindowInHours, request)
    ).rejects.toThrow("Unexpected response structure");

    expect(httpService.postAsync).toHaveBeenCalledWith(
      expect.stringContaining(routeToValidate),
      { route, SailingDate: formattedDate, timeWindowInHours },
      request
    );

    expect(global.appInsightsClient.trackException).toHaveBeenCalled();
  });

  it("should handle unexpected errors gracefully", async () => {
    httpService.postAsync.mockRejectedValue(new Error(unexpectedError));

    await expect(
      spsService.getSpsReferrals(route, date, timeWindowInHours, request)
    ).rejects.toThrow(unexpectedError);

    expect(httpService.postAsync).toHaveBeenCalledWith(
      expect.stringContaining(routeToValidate),
      { route, SailingDate: formattedDate, timeWindowInHours },
      request
    );
  });
});

describe("getCompleteCheckDetails", () => {
  let request;

  beforeEach(() => {
    request = {
      headers: {
        authorization: "Bearer mockToken",
      },
    };
    jest.clearAllMocks();
  });

          it('should fetch complete check details successfully', async () => {
            const checkSummaryId = "12345";
            const apiResponse = {
                data: {
                    checkOutcome: ["Outcome 1", "Outcome 2"],
                    reasonForReferral: ["Referral Reason"],
                    microchipNumber: "9876543210",
                    additionalComments: ["Comment 1", "Comment 2"],
                    gbCheckerName: "John Doe",
                    dateAndTimeChecked: "2024-12-11 10:30:00",
                    route: "Test Route",
                    scheduledDepartureDate: "2024-12-11",
                    scheduledDepartureTime: "10:30:00",
                },
            };

            httpService.postAsync.mockResolvedValue(apiResponse);

            const result = await spsService.getCompleteCheckDetails(
                checkSummaryId,
                request
            );

            expect(result).toEqual(apiResponse.data);
            expect(httpService.postAsync).toHaveBeenCalledWith(
                expect.stringContaining(getCompleteCheckDetails),
                { checkSummaryId },
                request
            );
        });

        it('should throw an error if API returns an error', async () => {
            const checkSummaryId = "12345";
            const apiError = { error: "Not Found" };
            httpService.postAsync.mockResolvedValue(apiError);

            await expect(
                spsService.getCompleteCheckDetails(checkSummaryId, request)
            ).rejects.toThrow("Not Found");

            expect(httpService.postAsync).toHaveBeenCalledWith(
                expect.stringContaining(getCompleteCheckDetails),
                { checkSummaryId },
                request
            );
        });

        it('should return null if API response data is null', async () => {
            const checkSummaryId = "12345";
            const apiResponse = { data: null };
            httpService.postAsync.mockResolvedValue(apiResponse);

            const result = await spsService.getCompleteCheckDetails(
                checkSummaryId,
                request
            );

            expect(result).toBeNull();
            expect(httpService.postAsync).toHaveBeenCalledWith(
                expect.stringContaining(getCompleteCheckDetails),
                { checkSummaryId },
                request
            );
        });

        it('should handle unexpected errors gracefully', async () => {
            const checkSummaryId = "12345";
            httpService.postAsync.mockRejectedValue(new Error(unexpectedError));

            await expect(
                spsService.getCompleteCheckDetails(checkSummaryId, request)
            ).rejects.toThrow(unexpectedError);

            expect(httpService.postAsync).toHaveBeenCalledWith(
                expect.stringContaining(getCompleteCheckDetails),
                { checkSummaryId },
                request
            );
        });
    
});

