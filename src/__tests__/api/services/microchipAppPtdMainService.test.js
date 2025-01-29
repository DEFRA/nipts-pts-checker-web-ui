import microchipApi from "../../../api/services/microchipAppPtdMainService";
import { MicrochipAppPtdMainModel } from "../../../api/models/microchipAppPtdMainModel";
import httpService from "../../../api/services/httpService";

jest.mock("../../../api/services/httpService");

const petOwnerName = "Pet Owner Name change";
const petOwnerEmail = "siri.kukkala+GB6@capgemini.com";
const addressLineOne = "CURRIE & BROWN UK LTD  40";
const addressLineTwo = " HOLBORN VIADUCT";

const issuingAuthorityAddressLineOne = "Pet Travel Section";
const issuingAuthorityAddressLineTwo = "Eden Bridge House";
const issuingAuthorityAddressLineThree = "Lowther Street";
const agencyName = "Animal and Plant Health Agency";
const signatoryName = "John Smith (APHA) (Signed digitally)";
const bearerToken = "Bearer mockToken"

const unexpectedErrorMessage = "Unexpected error occurred";

describe("getMicrochipData", () => {
  let request;

  beforeEach(() => {
    request = {
      // Mock request object
      headers: {
        authorization: bearerToken,
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
        petOwner: {
          name: petOwnerName,
          telephone: "07894465438",
          email: petOwnerEmail,
          address: {
            addressLineOne: addressLineOne,
            addressLineTwo: addressLineTwo,
            townOrCity: "LONDON",
            county: "",
            postCode: "EC1N 2PB"
          }
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
      petOwnerName: petOwnerName,
      petOwnerTelephone: "07894465438",
      petOwnerEmail: petOwnerEmail,
      petOwnerAddress: 
      {
        addressLineOne: addressLineOne,
        addressLineTwo: addressLineTwo,
        townOrCity: "LONDON",
        county: "",
        postCode: "EC1N 2PB"
      },
      issuingAuthority:  {
        address: {
                addressLineOne: issuingAuthorityAddressLineOne,
                addressLineThree: issuingAuthorityAddressLineThree,
                addressLineTwo: issuingAuthorityAddressLineTwo,
                county: "",
                postCode: "CA3 8DX",
                townOrCity: "Carlisle",
                },
        name: agencyName,
        signature: signatoryName,
      },
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
        petOwner: {
          name: "Pet Owner Name change",
          telephone: "07894465438",
          email: petOwnerEmail,
          address: {
            addressLineOne: addressLineOne,
            addressLineTwo: addressLineTwo,
            townOrCity: "LONDON",
            county: "",
            postCode: "EC1N 2PB"
          }
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
      petOwnerName: petOwnerName,
      petOwnerTelephone: "07894465438",
      petOwnerEmail: petOwnerEmail,
      petOwnerAddress: 
      {
        addressLineOne: addressLineOne,
        addressLineTwo: addressLineTwo,
        townOrCity: "LONDON",
        county: "",
        postCode: "EC1N 2PB"
      },
      issuingAuthority:  {
        address: {
                addressLineOne: issuingAuthorityAddressLineOne,
                addressLineThree: issuingAuthorityAddressLineThree,
                addressLineTwo: issuingAuthorityAddressLineTwo,
                county: "",
                postCode: "CA3 8DX",
                townOrCity: "Carlisle",
                },
        name: agencyName,
        signature: signatoryName,
      },
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
        petOwner: {
          name: petOwnerName,
          telephone: "07894465438",
          email: petOwnerEmail,
          address: {
            addressLineOne: addressLineOne,
            addressLineTwo: addressLineTwo,
            townOrCity: "LONDON",
            county: "",
            postCode: "EC1N 2PB"
          }
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
      petOwnerName: petOwnerName,
      petOwnerTelephone: "07894465438",
      petOwnerEmail: petOwnerEmail,
      petOwnerAddress: 
      {
        addressLineOne: addressLineOne,
        addressLineTwo: addressLineTwo,
        townOrCity: "LONDON",
        county: "",
        postCode: "EC1N 2PB"
      },
      issuingAuthority:  {
        address: {
                addressLineOne: issuingAuthorityAddressLineOne,
                addressLineThree: issuingAuthorityAddressLineThree,
                addressLineTwo: issuingAuthorityAddressLineTwo,
                county: "",
                postCode: "CA3 8DX",
                townOrCity: "Carlisle",
                },
        name: agencyName,
        signature: signatoryName,
      },
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
        petOwner: {
          name: petOwnerName,
          telephone: "07894465438",
          email: petOwnerEmail,
          address: {
            addressLineOne: addressLineOne,
            addressLineTwo: addressLineTwo,
            townOrCity: "LONDON",
            county: "",
            postCode: "EC1N 2PB"
          }
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
      petOwnerName: petOwnerName,
      petOwnerTelephone: "07894465438",
      petOwnerEmail: petOwnerEmail,
      petOwnerAddress: 
      {
        addressLineOne: addressLineOne,
        addressLineTwo: addressLineTwo,
        townOrCity: "LONDON",
        county: "",
        postCode: "EC1N 2PB"
      },
      issuingAuthority:  {
        address: {
                addressLineOne: issuingAuthorityAddressLineOne,
                addressLineThree: issuingAuthorityAddressLineThree,
                addressLineTwo: issuingAuthorityAddressLineTwo,
                county: "",
                postCode: "CA3 8DX",
                townOrCity: "Carlisle",
                },
        name: agencyName,
        signature: signatoryName,
      },
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

    const expectedError = { error: unexpectedErrorMessage };

    const data = await microchipApi.getMicrochipData(microchipNumber, request);

    expect(data).toEqual(expectedError);
  });

  it("should handle unexpected response structure gracefully", async () => {
    const microchipNumber = "123456789012345";
  
    httpService.postAsync.mockResolvedValue({ data: null });
  
    const expectedError = { error: unexpectedErrorMessage };
  
    const data = await microchipApi.getMicrochipData(microchipNumber, request);
  
    expect(data).toEqual(expectedError);
  });

  it("should return 'not_found' for specific error messages", async () => {
    const microchipNumber = "123456789012345";
  
    const errorResponse = {
      response: { data: { error: "Application not found" } },
    };
    httpService.postAsync.mockRejectedValue(errorResponse);
  
    const expectedError = { error: "not_found" };
  
    const data = await microchipApi.getMicrochipData(microchipNumber, request);
  
    expect(data).toEqual(expectedError);
  });

  it("should return the error message from the response if it is not 'Application not found' or 'Pet not found'", async () => {
    const microchipNumber = "123456789012345";
  
    const errorResponse = {
      response: { data: { error: "Unexpected server error" } },
    };
    httpService.postAsync.mockRejectedValue(errorResponse);
  
    const expectedError = { error: "Unexpected server error" };
  
    const data = await microchipApi.getMicrochipData(microchipNumber, request);
  
    expect(data).toEqual(expectedError);
  });
  
});

describe("checkMicrochipNumberExistWithPtd", () => {
  it("should return true when microchip number exists", async () => {
    const microchipNumber = "123456789012345";
    const request = {
      headers: {
        authorization: bearerToken,
      },
    };

    const apiResponse = {
      data: true,
    };

    httpService.postAsync.mockResolvedValue(apiResponse);

    const result = await microchipApi.checkMicrochipNumberExistWithPtd(microchipNumber, request);

    expect(result).toEqual({ exists: true });
  });

  it("should return false when microchip number does not exist", async () => {
    const microchipNumber = "987654321098765";
    const request = {
      headers: {
        authorization: bearerToken,
      },
    };

    const apiResponse = {
      data: false,
    };

    httpService.postAsync.mockResolvedValue(apiResponse);

    const result = await microchipApi.checkMicrochipNumberExistWithPtd(microchipNumber, request);

    expect(result).toEqual({ exists: false });
  });

  it("should return an error when API response contains an error", async () => {
    const microchipNumber = "123456789012345";
    const request = {
      headers: {
        authorization: bearerToken,
      },
    };

    const apiErrorResponse = {
      response: {
        data: {
          error: "Microchip not found",
        },
      },
    };

    httpService.postAsync.mockRejectedValue(apiErrorResponse);

    const result = await microchipApi.checkMicrochipNumberExistWithPtd(microchipNumber, request);

    expect(result).toEqual({ error: "Microchip not found" });
  });

  it("should return a generic error for unexpected exceptions", async () => {
    const microchipNumber = "123456789012345";
    const request = {
      headers: {
        authorization: bearerToken,
      },
    };

    httpService.postAsync.mockRejectedValue(new Error("Unexpected error"));

    const result = await microchipApi.checkMicrochipNumberExistWithPtd(microchipNumber, request);

    expect(result).toEqual({ error: unexpectedErrorMessage });
  });
});

