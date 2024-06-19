import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import microchipApi from "../../../api/services/microchipAppPtdMainService";
import { MicrochipAppPtdMainModel } from "../../../api/models/microchipAppPtdMainModel";

describe("getMicrochipData", () => {
  it("should fetch data and map it to MicrochipAppPtdMainModel with correct status mapping", async () => {
    const mock = new MockAdapter(axios);
    const microchipNumber = "123456789012345";
    const apiResponse = {
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
        travelDocumentDateOfIssue: "2024-06-12T10:26:52.0391239",
      },
    };

    // Mock the POST request to the API
    mock
      .onPost(`${process.env.BASE_API_URL}/api/Checker/checkMicrochipNumber`, {
        microchipNumber,
      })
      .reply(200, apiResponse);

    const expectedData = new MicrochipAppPtdMainModel({
      petId: "715bb304-1ca8-46ba-552d-08dc28c44b63",
      petName: "fido",
      petSpecie: "Dog",
      petBreed: "Bulldog",
      documentState: "awaiting",
      ptdNumber: "SZWPFXEG",
      issuedDate: "2024-02-09T11:31:29.7165377",
      microchipDate: "2021-02-01T00:00:00",
      petSex: "Male",
      petDoB: "2021-01-01T00:00:00",
      petColour: "White, cream or sand",
      petFeaturesDetail: "None",
      applicationId: "ae3d5e79-8821-47ae-5556-08dc295ccb5b",
      travelDocumentId: "e385b94e-5d75-4015-611a-08dc295ccb0b",
      dateOfIssue: "2024-06-12T10:26:52.0391239",
    });

    const data = await microchipApi.getMicrochipData(microchipNumber);

    expect(data).toEqual(expectedData);
  });

  it("should return error when pet is not found", async () => {
    const mock = new MockAdapter(axios);
    const microchipNumber = "123456789012345";
    const apiResponse = { error: "Pet not found" };

    // Mock the POST request to the API
    mock
      .onPost(`${process.env.BASE_API_URL}/api/Checker/checkMicrochipNumber`, {
        microchipNumber,
      })
      .reply(200, apiResponse);

    const expectedError = { error: "Pet not found" };

    const data = await microchipApi.getMicrochipData(microchipNumber);

    expect(data).toEqual(expectedError);
  });

  it("should handle unexpected errors gracefully", async () => {
    const mock = new MockAdapter(axios);
    const microchipNumber = "123456789012345";

    // Mock the POST request to the API
    mock
      .onPost(`${process.env.BASE_API_URL}/api/Checker/checkMicrochipNumber`, {
        microchipNumber,
      })
      .reply(500, {});

    const expectedError = { error: "Unexpected error occurred" };

    const data = await microchipApi.getMicrochipData(microchipNumber);

    expect(data).toEqual(expectedError);
  });

  it("should fetch data and map it to MicrochipAppPtdMainModel when travel document is revoked", async () => {
    const mock = new MockAdapter(axios);
    const microchipNumber = "123456789012345";
    const apiResponse = {
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
        status: "REVOKED",
      },
      travelDocument: {
        travelDocumentId: "e385b94e-5d75-4015-611a-08dc295ccb0b",
        travelDocumentReferenceNumber: "GB826J40C050",
        travelDocumentDateOfIssue: "2024-06-12T10:26:52.0391239",
      },
    };

    // Mock the POST request to the API
    mock
      .onPost(`${process.env.BASE_API_URL}/api/Checker/checkMicrochipNumber`, {
        microchipNumber,
      })
      .reply(200, apiResponse);

    const expectedData = new MicrochipAppPtdMainModel({
      petId: "715bb304-1ca8-46ba-552d-08dc28c44b63",
      petName: "fido",
      petSpecie: "Dog",
      petBreed: "Bulldog",
      documentState: "revoked",
      ptdNumber: "GB826J40C050",
      issuedDate: "2024-06-12T10:26:52.0391239",
      microchipDate: "2021-02-01T00:00:00",
      petSex: "Male",
      petDoB: "2021-01-01T00:00:00",
      petColour: "White, cream or sand",
      petFeaturesDetail: "None",
      applicationId: "ae3d5e79-8821-47ae-5556-08dc295ccb5b",
      travelDocumentId: "e385b94e-5d75-4015-611a-08dc295ccb0b",
      dateOfIssue: "2024-06-12T10:26:52.0391239",
    });

    const data = await microchipApi.getMicrochipData(microchipNumber);

    expect(data).toEqual(expectedData);
  });
});
