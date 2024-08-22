import microchipApi from "../../../api/services/microchipAppPtdMainService";
import { MicrochipAppPtdMainModel } from "../../../api/models/microchipAppPtdMainModel";
import httpService from "../../../api/services/httpService";

jest.mock("../../../api/services/httpService");

describe("getMicrochipData", () => {
  let request;

  beforeEach(() => {
    request = {
      // Mock request object
      headers: {
        authorization: "Bearer mockToken",
      },
    };
    jest.clearAllMocks();
  });

  it("should fetch data and map it to MicrochipAppPtdMainModel with correct status mapping", async () => {
    const microchipNumber = "123456789012345";
    const apiResponse = {
      data: {
        pet: {
          petId: "715bb304-1ca8-46ba-552d-08dc28c44b63",
          petName: "fido",
          species: "Dog",
          breedName: "Bulldog",
          colourName: "White, cream or sand",
          sex: "Male",
          dateOfBirth: "2021-01-01T00:00:00",
          microchippedDate: "2021-02-01T00:00:00",
          significantFeatures: "None",
        },
        application: {
          applicationId: "ae3d5e79-8821-47ae-5556-08dc295ccb5b",
          referenceNumber: "SZWPFXEG",
          dateOfApplication: "2024-02-09T11:31:29.7165377",
          status: "AWAITING VERIFICATION",
        },
        travelDocument: {
          travelDocumentId: "e385b94e-5d75-4015-611a-08dc295ccb0b",
          travelDocumentReferenceNumber: "GB826J40C050",
          dateOfIssue: "2024-06-12T10:26:52.0391239",
        },
      },
    };

    httpService.postAsync.mockResolvedValue(apiResponse);

    const expectedData = new MicrochipAppPtdMainModel({
      petId: "715bb304-1ca8-46ba-552d-08dc28c44b63",
      petName: "fido",
      petSpecies: "Dog",
      petBreed: "Bulldog",
      documentState: "awaiting",
      ptdNumber: "SZWPFXEG",
      issuedDate: "09/02/2024", // Formatted date
      microchipNumber,
      microchipDate: "01/02/2021", // Formatted date
      petSex: "Male",
      petDoB: "01/01/2021", // Formatted date
      petColour: "White, cream or sand",
      petFeaturesDetail: "None",
      applicationId: "ae3d5e79-8821-47ae-5556-08dc295ccb5b",
      travelDocumentId: "e385b94e-5d75-4015-611a-08dc295ccb0b",
      dateOfIssue: "2024-06-12T10:26:52.0391239",
    });

    const data = await microchipApi.getMicrochipData(microchipNumber, request);

    expect(data).toEqual(expectedData);
  });

  it("should fetch data and map it to MicrochipAppPtdMainModel with correct status mapping when approved", async () => {
    const microchipNumber = "123456789012345";
    const apiResponse = {
      data: {
        pet: {
          petId: "715bb304-1ca8-46ba-552d-08dc28c44b63",
          petName: "fido",
          species: "Dog",
          breedName: "Bulldog",
          colourName: "White, cream or sand",
          sex: "Male",
          dateOfBirth: "2021-01-01T00:00:00",
          microchippedDate: "2021-02-01T00:00:00",
          significantFeatures: "None",
        },
        application: {
          applicationId: "ae3d5e79-8821-47ae-5556-08dc295ccb5b",
          referenceNumber: "SZWPFXEG",
          dateOfApplication: "2024-02-09T11:31:29.7165377",
          status: "approved",
        },
        travelDocument: {
          travelDocumentId: "e385b94e-5d75-4015-611a-08dc295ccb0b",
          travelDocumentReferenceNumber: "GB826J40C050",
          dateOfIssue: "2024-06-12T10:26:52.0391239",
        },
      },
    };

    httpService.postAsync.mockResolvedValue(apiResponse);

    const expectedData = new MicrochipAppPtdMainModel({
      petId: "715bb304-1ca8-46ba-552d-08dc28c44b63",
      petName: "fido",
      petSpecies: "Dog",
      petBreed: "Bulldog",
      documentState: "approved",
      ptdNumber: "GB826J40C050",
      microchipNumber,
      microchipDate: "01/02/2021", // Formatted date
      petSex: "Male",
      petDoB: "01/01/2021", // Formatted date
      petColour: "White, cream or sand",
      petFeaturesDetail: "None",
      applicationId: "ae3d5e79-8821-47ae-5556-08dc295ccb5b",
      travelDocumentId: "e385b94e-5d75-4015-611a-08dc295ccb0b",
      dateOfIssue: "2024-06-12T10:26:52.0391239",
    });

    const data = await microchipApi.getMicrochipData(microchipNumber, request);

    expect(data).toEqual(expectedData);
  });

  it("should fetch data and map it to MicrochipAppPtdMainModel with correct status mapping when revoked", async () => {
    const microchipNumber = "123456789012345";
    const apiResponse = {
      data: {
        pet: {
          petId: "715bb304-1ca8-46ba-552d-08dc28c44b63",
          petName: "fido",
          species: "Dog",
          breedName: "Bulldog",
          colourName: "White, cream or sand",
          sex: "Male",
          dateOfBirth: "2021-01-01T00:00:00",
          microchippedDate: "2021-02-01T00:00:00",
          significantFeatures: "None",
        },
        application: {
          applicationId: "ae3d5e79-8821-47ae-5556-08dc295ccb5b",
          referenceNumber: "SZWPFXEG",
          dateOfApplication: "2024-02-09T11:31:29.7165377",
          status: "revoked",
        },
        travelDocument: {
          travelDocumentId: "e385b94e-5d75-4015-611a-08dc295ccb0b",
          travelDocumentReferenceNumber: "GB826J40C050",
          dateOfIssue: "2024-06-12T10:26:52.0391239",
        },
      },
    };

    httpService.postAsync.mockResolvedValue(apiResponse);

    const expectedData = new MicrochipAppPtdMainModel({
      petId: "715bb304-1ca8-46ba-552d-08dc28c44b63",
      petName: "fido",
      petSpecies: "Dog",
      petBreed: "Bulldog",
      documentState: "revoked",
      ptdNumber: "GB826J40C050",
      microchipNumber,
      microchipDate: "01/02/2021", // Formatted date
      petSex: "Male",
      petDoB: "01/01/2021", // Formatted date
      petColour: "White, cream or sand",
      petFeaturesDetail: "None",
      applicationId: "ae3d5e79-8821-47ae-5556-08dc295ccb5b",
      travelDocumentId: "e385b94e-5d75-4015-611a-08dc295ccb0b",
      dateOfIssue: "2024-06-12T10:26:52.0391239",
    });

    const data = await microchipApi.getMicrochipData(microchipNumber, request);

    expect(data).toEqual(expectedData);
  });

  it("should fetch data and map it to MicrochipAppPtdMainModel with correct status mapping when rejected", async () => {
    const microchipNumber = "123456789012345";
    const apiResponse = {
      data: {
        pet: {
          petId: "715bb304-1ca8-46ba-552d-08dc28c44b63",
          petName: "fido",
          species: "Dog",
          breedName: "Bulldog",
          colourName: "White, cream or sand",
          sex: "Male",
          dateOfBirth: "2021-01-01T00:00:00",
          microchippedDate: "2021-02-01T00:00:00",
          significantFeatures: "None",
        },
        application: {
          applicationId: "ae3d5e79-8821-47ae-5556-08dc295ccb5b",
          referenceNumber: "SZWPFXEG",
          dateOfApplication: "2024-02-09T11:31:29.7165377",
          status: "rejected",
        },
        travelDocument: {
          travelDocumentId: "e385b94e-5d75-4015-611a-08dc295ccb0b",
          travelDocumentReferenceNumber: "GB826J40C050",
          dateOfIssue: "2024-06-12T10:26:52.0391239",
        },
      },
    };

    httpService.postAsync.mockResolvedValue(apiResponse);

    const expectedData = new MicrochipAppPtdMainModel({
      petId: "715bb304-1ca8-46ba-552d-08dc28c44b63",
      petName: "fido",
      petSpecies: "Dog",
      petBreed: "Bulldog",
      documentState: "rejected",
      ptdNumber: "SZWPFXEG",
      microchipNumber,
      microchipDate: "01/02/2021", // Formatted date
      petSex: "Male",
      petDoB: "01/01/2021", // Formatted date
      petColour: "White, cream or sand",
      petFeaturesDetail: "None",
      applicationId: "ae3d5e79-8821-47ae-5556-08dc295ccb5b",
      travelDocumentId: "e385b94e-5d75-4015-611a-08dc295ccb0b",
      dateOfIssue: "2024-06-12T10:26:52.0391239",
    });

    const data = await microchipApi.getMicrochipData(microchipNumber, request);

    expect(data).toEqual(expectedData);
  });

  it("should return error when pet is not found", async () => {
    const microchipNumber = "123456789012345";
    const apiResponse = { error: { error: "Pet not found" } };

    httpService.postAsync.mockResolvedValue(apiResponse);

    const expectedError = { error: "not_found" };

    const data = await microchipApi.getMicrochipData(microchipNumber, request);

    expect(data).toEqual(expectedError);
  });

  it("should handle unexpected errors gracefully", async () => {
    const microchipNumber = "123456789012345";

    httpService.postAsync.mockRejectedValue(new Error("Unexpected error"));

    const expectedError = { error: "Unexpected error occurred" };

    const data = await microchipApi.getMicrochipData(microchipNumber, request);

    expect(data).toEqual(expectedError);
  });
});
