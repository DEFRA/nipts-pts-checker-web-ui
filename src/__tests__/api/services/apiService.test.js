import apiService from "../../../api/services/apiService.js";
import httpService from "../../../api/services/httpService.js";
import { HttpStatusCode } from "axios";
import moment from "moment";
import { organisationMainModel } from "../../../api/models/organisationMainModel.js";
import { MicrochipAppPtdMainModel } from "../../../api/models/microchipAppPtdMainModel.js";

jest.mock("../../../api/services/httpService.js");
jest.mock("axios");
jest.mock("moment");

const petOwnerName = "Pet Owner Name change";
const petOwnerEmail = "siri.kukkala+GB6@capgemini.com";
const addressLineOne = "CURRIE & BROWN UK LTD  40"
const addressLineTwo = " HOLBORN VIADUCT";

const issuingAuthorityAddressLineOne = "Pet Travel Section";
const issuingAuthorityAddressLineTwo = "Eden Bridge House";
const issuingAuthorityAddressLineThree = "Lowther Street";
const agencyName = "Animal and Plant Health Agency";
const signatoryName = "John Smith (APHA) (Signed digitally)";

const baseUrl =
  process.env.BASE_API_URL || "https://devptswebaw1003.azurewebsites.net/api";

  const dateOfIssue = "2023-02-01";
  const multiUseDate = "01/01/2022";

  const applicationNotFoundMessage = "Application not found";
  const unexpectedErrorMessage = "Unexpected error";

  const getOrganisationRoute = "/Checker/getOrganisation";
  const organisationId = "9245A7BB-F2A4-4BD7-AD9F-08DC32FA7B20";
  const unexpectedResponseStructure = "Unexpected response structure";

describe("apiService", () => {
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

  describe("getApplicationByPTDNumber", () => {
    it("should return transformed data when PTD number is valid", async () => {
      const mockResponse = {
        data: {
          pet: {
            petId: "1",
            petName: "Buddy",
            species: "Dog",
            breedName: "Beagle",
            microchipNumber: "123456789",
            microchippedDate: "2022-01-01",
            dateOfBirth: "2020-01-01",
            sex: "Male",
            colourName: "Brown",
            significantFeatures: "None",
          },
          application: {
            status: "authorised",
            applicationId: "app123",
            dateAuthorised: "2023-01-01",
          },
          travelDocument: {
            travelDocumentReferenceNumber: "GB826TD123",
            travelDocumentId: "td123",
            dateOfIssue: dateOfIssue
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
        }
      };

      httpService.postAsync.mockResolvedValue({
        status: 200,
        data: mockResponse.data,
      });
      moment.mockImplementation((_date) => ({
        format: () => multiUseDate,
      }));

      const result = await apiService.getApplicationByPTDNumber(
        "123456",
        request
      );
      expect(httpService.postAsync).toHaveBeenCalledWith(
        `${baseUrl}/Checker/checkPTDNumber`,
        { ptdNumber: "123456" },
        request
      );

      const expectedInstance = new MicrochipAppPtdMainModel({
        petId: "1",
        petName: "Buddy",
        petSpecies: "Dog",
        petBreed: "Beagle",
        documentState: "approved",
        ptdNumber: "GB826TD123",
        issuedDate: multiUseDate,
        microchipNumber: "123456789",
        microchipDate: multiUseDate,
        petSex: "Male",
        petDoB: multiUseDate,
        petColour: "Brown",
        petFeaturesDetail: "None",
        applicationId: "app123",
        travelDocumentId: "td123",
        dateOfIssue: dateOfIssue,
        petOwnerName: petOwnerName,
        petOwnerEmail: petOwnerEmail,
        petOwnerTelephone: "07894465438",
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

      expect(result).toEqual(expectedInstance);
    });

    it("should return transformed data when PTD number is valid & revoked", async () => {
      const mockResponse = {
        data: {
          pet: {
            petId: "1",
            petName: "Buddy",
            species: "Dog",
            breedName: "Beagle",
            microchipNumber: "123456789",
            microchippedDate: "2022-01-01",
            dateOfBirth: "2020-01-01",
            sex: "Male",
            colourName: "Brown",
            significantFeatures: "None",
          },
          application: {
            status: "revoked",
            applicationId: "app123",
            dateAuthorised: "2023-01-01",
          },
          travelDocument: {
            travelDocumentReferenceNumber: "GB826TD123",
            travelDocumentId: "td123",
            dateOfIssue: dateOfIssue
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

      httpService.postAsync.mockResolvedValue({
        status: 200,
        data: mockResponse.data,
      });
      moment.mockImplementation((_date) => ({
        format: () => multiUseDate,
      }));

      const result = await apiService.getApplicationByPTDNumber(
        "123456",
        request
      );
      expect(httpService.postAsync).toHaveBeenCalledWith(
        `${baseUrl}/Checker/checkPTDNumber`,
        { ptdNumber: "123456" },
        request
      );

      const expectedInstance = new MicrochipAppPtdMainModel({
        petId: "1",
        petName: "Buddy",
        petSpecies: "Dog",
        petBreed: "Beagle",
        documentState: "revoked",
        ptdNumber: "GB826TD123",
        microchipNumber: "123456789",
        microchipDate: multiUseDate,
        petSex: "Male",
        petDoB: multiUseDate,
        petColour: "Brown",
        petFeaturesDetail: "None",
        applicationId: "app123",
        travelDocumentId: "td123",
        dateOfIssue: dateOfIssue,
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

      expect(result).toEqual(expectedInstance);
    });

    it("should return transformed data when PTD number is valid & status is unknown", async () => {
      const mockResponse = {
        data: {
          pet: {
            petId: "1",
            petName: "Buddy",
            species: "Dog",
            breedName: "Beagle",
            microchipNumber: "123456789",
            microchippedDate: "2022-01-01",
            dateOfBirth: "2020-01-01",
            sex: "Male",
            colourName: "Brown",
            significantFeatures: "None",
          },
          application: {
            status: "rejected",
            applicationId: "app123",
            dateAuthorised: "2023-01-01",
          },
          travelDocument: {
            travelDocumentReferenceNumber: "GB826TD123",
            travelDocumentId: "td123",
            dateOfIssue: dateOfIssue
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

      httpService.postAsync.mockResolvedValue({
        status: 200,
        data: mockResponse.data,
      });
      moment.mockImplementation((_date) => ({
        format: () => multiUseDate,
      }));

      const result = await apiService.getApplicationByPTDNumber(
        "123456",
        request
      );
      expect(httpService.postAsync).toHaveBeenCalledWith(
        `${baseUrl}/Checker/checkPTDNumber`,
        { ptdNumber: "123456" },
        request
      );

      const expectedInstance = new MicrochipAppPtdMainModel({
        petId: "1",
        petName: "Buddy",
        petSpecies: "Dog",
        petBreed: "Beagle",
        documentState: "rejected",
        microchipNumber: "123456789",
        microchipDate: multiUseDate,
        petSex: "Male",
        petDoB: multiUseDate,
        petColour: "Brown",
        petFeaturesDetail: "None",
        applicationId: "app123",
        travelDocumentId: "td123",
        dateOfIssue: dateOfIssue,
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

      expect(result).toEqual(expectedInstance);
    });

    it("should return transformed data when PTD number is valid & rejected", async () => {
      const mockResponse = {
        data: {
          pet: {
            petId: "1",
            petName: "Buddy",
            species: "Dog",
            breedName: "Beagle",
            microchipNumber: "123456789",
            microchippedDate: "2022-01-01",
            dateOfBirth: "2020-01-01",
            sex: "Male",
            colourName: "Brown",
            significantFeatures: "None",
          },
          application: {
            status: "",
            applicationId: "app123",
            dateAuthorised: "2023-01-01",
          },
          travelDocument: {
            travelDocumentReferenceNumber: "GB826TD123",
            travelDocumentId: "td123",
            dateOfIssue: dateOfIssue
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

      httpService.postAsync.mockResolvedValue({
        status: 200,
        data: mockResponse.data,
      });
      moment.mockImplementation((_date) => ({
        format: () => multiUseDate,
      }));

      const result = await apiService.getApplicationByPTDNumber(
        "123456",
        request
      );
      expect(httpService.postAsync).toHaveBeenCalledWith(
        `${baseUrl}/Checker/checkPTDNumber`,
        { ptdNumber: "123456" },
        request
      );

      const expectedInstance = new MicrochipAppPtdMainModel({
        petId: "1",
        petName: "Buddy",
        petSpecies: "Dog",
        petBreed: "Beagle",
        documentState: "",
        microchipNumber: "123456789",
        microchipDate: multiUseDate,
        petSex: "Male",
        petDoB: multiUseDate,
        petColour: "Brown",
        petFeaturesDetail: "None",
        applicationId: "app123",
        travelDocumentId: "td123",
        dateOfIssue: dateOfIssue,
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

      expect(result).toEqual(expectedInstance);
    });


    it("should return error when PTD number is not found", async () => {
      httpService.postAsync.mockResolvedValue({
        status: 404,
        error: applicationNotFoundMessage,
      });

      const result = await apiService.getApplicationByPTDNumber(
        "123459",
        request
      );
      expect(httpService.postAsync).toHaveBeenCalledWith(
        `${baseUrl}/Checker/checkPTDNumber`,
        { ptdNumber: "123459" },
        request
      );
      expect(result).toEqual({ error: "not_found" });
    });

    it("should return error when application is not found", async () => {
      const mockResponse = {
        data: {
          pet: { petId: "1", petName: "Buddy" },
        },
      };

      httpService.postAsync.mockResolvedValue({
        status: 200,
        data: mockResponse.data,
      });

      const result = await apiService.getApplicationByPTDNumber(
        "123456",
        request
      );
      expect(result).toEqual({ error: applicationNotFoundMessage });
    });

    it("should return error when pet is not found", async () => {
      const mockResponse = {
        data: {
        },
      };

      httpService.postAsync.mockResolvedValue({
        status: 200,
        data: mockResponse.data,
      });

      const result = await apiService.getApplicationByPTDNumber(
        "123456",
        request
      );
      expect(result).toEqual({ error: "Pet not found" });
    });

    it("should return error when traveldocument is not found", async () => {
      const mockResponse = {
        data: {
          pet: { petId: "1", petName: "Buddy" },
          application: {}
        },
      };

      httpService.postAsync.mockResolvedValue({
        status: 200,
        data: mockResponse.data,
      });

      const result = await apiService.getApplicationByPTDNumber(
        "123456",
        request
      );
      expect(result).toEqual({ error: "TravelDocument not found" });
    });


    it("should return unexpected error when an exception occurs", async () => {
      httpService.postAsync.mockRejectedValue(new Error(unexpectedErrorMessage));

      const result = await apiService.getApplicationByPTDNumber(
        "123456",
        request
      );
      expect(result).toEqual({ error: unexpectedErrorMessage });
    });
  });

  describe("getApplicationByApplicationNumber", () => {
    it("should return transformed data when application number is valid", async () => {
      const mockResponse = {
        data: {
          pet: {
            petId: "1",
            petName: "Buddy",
            species: "Dog",
            breedName: "Beagle",
            microchipNumber: "123456789",
            microchippedDate: "2022-01-01",
            dateOfBirth: "2020-01-01",
            sex: "Male",
            colourName: "Brown",
            significantFeatures: "None",
          },
          application: {
            status: "authorised",
            applicationId: "app123",
            dateAuthorised: "2023-01-01",
          },
          travelDocument: {
            travelDocumentReferenceNumber: "GB826TD123",
            travelDocumentId: "td123",
            dateOfIssue: dateOfIssue
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

      httpService.postAsync.mockResolvedValue({
        status: 200,
        data: mockResponse.data,
      });
      moment.mockImplementation((_date) => ({
        format: () => multiUseDate,
      }));

      const result = await apiService.getApplicationByApplicationNumber(
        "app123",
        request
      );
      expect(httpService.postAsync).toHaveBeenCalledWith(
        `${baseUrl}/Checker/checkApplicationNumber`,
        { applicationNumber: "app123" },
        request
      );

      const expectedInstance = new MicrochipAppPtdMainModel({
        petId: "1",
        petName: "Buddy",
        petSpecies: "Dog",
        petBreed: "Beagle",
        documentState: "approved",
        ptdNumber: "GB826TD123",
        issuedDate: multiUseDate,
        microchipNumber: "123456789",
        microchipDate: multiUseDate,
        petSex: "Male",
        petDoB: multiUseDate,
        petColour: "Brown",
        petFeaturesDetail: "None",
        applicationId: "app123",
        travelDocumentId: "td123",
        dateOfIssue: dateOfIssue,
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

      expect(result).toEqual(expectedInstance);
    });

    it("should return transformed data when application number is valid and revoked", async () => {
      const mockResponse = {
        data: {
          pet: {
            petId: "1",
            petName: "Buddy",
            species: "Dog",
            breedName: "Beagle",
            microchipNumber: "123456789",
            microchippedDate: "2022-01-01",
            dateOfBirth: "2020-01-01",
            sex: "Male",
            colourName: "Brown",
            significantFeatures: "None",
          },
          application: {
            status: "revoked",
            applicationId: "app123",
            dateAuthorised: "2023-01-01",
          },
          travelDocument: {
            travelDocumentReferenceNumber: "GB826TD123",
            travelDocumentId: "td123",
            dateOfIssue: dateOfIssue
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

      httpService.postAsync.mockResolvedValue({
        status: 200,
        data: mockResponse.data,
      });
      moment.mockImplementation((_date) => ({
        format: () => multiUseDate,
      }));

      const result = await apiService.getApplicationByApplicationNumber(
        "app123",
        request
      );
      expect(httpService.postAsync).toHaveBeenCalledWith(
        `${baseUrl}/Checker/checkApplicationNumber`,
        { applicationNumber: "app123" },
        request
      );

      const expectedInstance = new MicrochipAppPtdMainModel({
        petId: "1",
        petName: "Buddy",
        petSpecies: "Dog",
        petBreed: "Beagle",
        ptdNumber: "GB826TD123",
        documentState: "revoked",
        microchipNumber: "123456789",
        microchipDate: multiUseDate,
        petSex: "Male",
        petDoB: multiUseDate,
        petColour: "Brown",
        petFeaturesDetail: "None",
        applicationId: "app123",
        travelDocumentId: "td123",
        dateOfIssue: dateOfIssue,
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

      expect(result).toEqual(expectedInstance);
    });

    it("should return transformed data when application number is valid and rejected", async () => {
      const mockResponse = {
        data: {
          pet: {
            petId: "1",
            petName: "Buddy",
            species: "Dog",
            breedName: "Beagle",
            microchipNumber: "123456789",
            microchippedDate: "2022-01-01",
            dateOfBirth: "2020-01-01",
            sex: "Male",
            colourName: "Brown",
            significantFeatures: "None",
          },
          application: {
            status: "rejected",
            applicationId: "app123",
            dateAuthorised: "2023-01-01",
          },
          travelDocument: {
            travelDocumentReferenceNumber: "GB826TD123",
            travelDocumentId: "td123",
            dateOfIssue: dateOfIssue
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

      httpService.postAsync.mockResolvedValue({
        status: 200,
        data: mockResponse.data,
      });
      moment.mockImplementation((_date) => ({
        format: () => multiUseDate,
      }));

      const result = await apiService.getApplicationByApplicationNumber(
        "app123",
        request
      );
      expect(httpService.postAsync).toHaveBeenCalledWith(
        `${baseUrl}/Checker/checkApplicationNumber`,
        { applicationNumber: "app123" },
        request
      );

      const expectedInstance = new MicrochipAppPtdMainModel({
        petId: "1",
        petName: "Buddy",
        petSpecies: "Dog",
        petBreed: "Beagle",
        documentState: "rejected",
        microchipNumber: "123456789",
        microchipDate: multiUseDate,
        petSex: "Male",
        petDoB: multiUseDate,
        petColour: "Brown",
        petFeaturesDetail: "None",
        applicationId: "app123",
        travelDocumentId: "td123",
        dateOfIssue: dateOfIssue,
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

      expect(result).toEqual(expectedInstance);
    });

    it("should return transformed data when application number is valid and status is unknown", async () => {
      const mockResponse = {
        data: {
          pet: {
            petId: "1",
            petName: "Buddy",
            species: "Dog",
            breedName: "Beagle",
            microchipNumber: "123456789",
            microchippedDate: "2022-01-01",
            dateOfBirth: "2020-01-01",
            sex: "Male",
            colourName: "Brown",
            significantFeatures: "None",
          },
          application: {
            status:"",
            applicationId: "app123",
            dateAuthorised: "2023-01-01",
          },
          travelDocument: {
            travelDocumentReferenceNumber: "GB826TD123",
            travelDocumentId: "td123",
            dateOfIssue: dateOfIssue
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
        }
      };

      httpService.postAsync.mockResolvedValue({
        status: 200,
        data: mockResponse.data,
      });
      moment.mockImplementation((_date) => ({
        format: () => multiUseDate,
      }));

      const result = await apiService.getApplicationByApplicationNumber(
        "app123",
        request
      );
      expect(httpService.postAsync).toHaveBeenCalledWith(
        `${baseUrl}/Checker/checkApplicationNumber`,
        { applicationNumber: "app123" },
        request
      );

      const expectedInstance = new MicrochipAppPtdMainModel({
        petId: "1",
        petName: "Buddy",
        petSpecies: "Dog",
        petBreed: "Beagle",
        documentState: "",
        microchipNumber: "123456789",
        microchipDate: multiUseDate,
        petSex: "Male",
        petDoB: multiUseDate,
        petColour: "Brown",
        petFeaturesDetail: "None",
        applicationId: "app123",
        travelDocumentId: "td123",
        dateOfIssue: dateOfIssue,
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

      expect(result).toEqual(expectedInstance);
    });


    it("should return error when application number is not found", async () => {
      httpService.postAsync.mockResolvedValue({
        status: 404,
        error: applicationNotFoundMessage,
      });

      const result = await apiService.getApplicationByApplicationNumber(
        "app123",
        request
      );
      expect(result).toEqual({ error: "not_found" });
    });

    it("should return error when pet is not found", async () => {
      const mockResponse = {
        data: {
        },
      };

      httpService.postAsync.mockResolvedValue({
        status: 200,
        data: mockResponse.data,
      });

      const result = await apiService.getApplicationByApplicationNumber(
        "app123",
        request
      );
      expect(result).toEqual({ error: "Pet not found" });
    });

    it("should return error when traveldocument is not found", async () => {
      const mockResponse = {
        data: {
          pet: {},
          application: {}
        },
      };

      httpService.postAsync.mockResolvedValue({
        status: 200,
        data: mockResponse.data,
      });

      const result = await apiService.getApplicationByApplicationNumber(
        "app123",
        request
      );
      expect(result).toEqual({ error: "TravelDocument not found" });
    });

    it("should return error when application is not found", async () => {
      const mockResponse = {
        data: {
          pet: { petId: "1", petName: "Buddy" },
        },
      };

      httpService.postAsync.mockResolvedValue({
        status: 200,
        data: mockResponse.data,
      });

      const result = await apiService.getApplicationByApplicationNumber(
        "app123",
        request
      );
      expect(result).toEqual({ error: applicationNotFoundMessage });
    });

    it("should return error when application number is not found", async () => {
      httpService.postAsync.mockResolvedValue({
        status: 404,
        error: applicationNotFoundMessage,
      });

      const result = await apiService.getApplicationByApplicationNumber(
        "app123",
        request
      );
      expect(result).toEqual({ error: "not_found" });
    });

    it("should return unexpected error when an exception occurs", async () => {
      httpService.postAsync.mockRejectedValue(new Error(unexpectedErrorMessage));

      const result = await apiService.getApplicationByApplicationNumber(
        "app123",
        request
      );
      expect(result).toEqual({ error: unexpectedErrorMessage });
    });
  });

  describe("recordCheckOutCome", () => {
    it("should return the check summary id on success", async () => {
      const checkOutcome = { applicationId: "app1", checkOutcome: "pass" };
      const mockResponse = {
        status: HttpStatusCode.OK,
        data: { checkSummaryId: "summary1" },
      };

      httpService.postAsync.mockResolvedValue({
        status: 200,
        data: mockResponse.data,
      });

      const result = await apiService.recordCheckOutCome(checkOutcome);

      expect(result).toBe("summary1");
    });

    it("should handle errors properly", async () => {
      const checkOutcome = { applicationId: "app1", checkOutcome: "pass" };
      const mockError = new Error("Test error");
      httpService.postAsync.mockResolvedValue(mockError);

      const result = await apiService.recordCheckOutCome(checkOutcome);

      expect(result).toEqual({ error: unexpectedResponseStructure });
    });
  });

  describe("saveCheckerUser", () => {
    it("should return the summary id on success", async () => {
      const checkOutcome = { applicationId: "app1", checkOutcome: "pass" };
      const mockResponse = {
        status: HttpStatusCode.OK,
        data: { checkSummaryId: "summary1" },
      };

      httpService.postAsync.mockResolvedValue({
        status: 200,
        data: mockResponse.data,
      });

      const result = await apiService.saveCheckerUser(checkOutcome);

      expect(result).toStrictEqual({"checkSummaryId": "summary1"});
    });

    it("should handle errors properly", async () => {
      const checkOutcome = { applicationId: "app1", checkOutcome: "pass" };
      const mockError = new Error("Test error");
      httpService.postAsync.mockResolvedValue(mockError);

      const result = await apiService.saveCheckerUser(checkOutcome);

      expect(result).toEqual({ error: unexpectedResponseStructure });
    });
  });

  describe("getOrganisation", () => {

    it("should fetch data and map it to OrganisationMainModel", async () => {
      const requestData =   { organisationId: organisationId };
      const apiResponse = {
        data: 
          {
            id: organisationId,
            name: "Golden Retriever, friendly and playful",
            location: "NI",
            externalId: null,
            activeFrom: "11/11/2024",
            activeTo: null,
            isActive: true,
          }
      };

      httpService.postAsync.mockResolvedValue({
        status: 200,
        data: apiResponse.data,
      });
  
      const expectedData = organisationMainModel({
        Id: organisationId,
        Name: "Golden Retriever, friendly and playful",
        Location: "NI",
        ExternalId: null,
        ActiveFrom: "11/11/2024",
        ActiveTo: null,
        IsActive: true,
      });
  
      const data = await apiService.getOrganisation(
        organisationId,
        request
      );
  
      expect(data).toEqual(expectedData);
      expect(httpService.postAsync).toHaveBeenCalledWith(
        expect.stringContaining(getOrganisationRoute),
         requestData,
        request // Pass the request object as the third parameter
      );

    });
  
    it("should return an error if the API returns an error", async () => {
      const requestData =   { organisationId: organisationId };
      const apiError = { error: "Not Found" };
      httpService.postAsync.mockResolvedValue(apiError);
  
      const result = await apiService.getOrganisation(
        organisationId,
        request
      );
  
      expect(result).toEqual({ error: apiError.error });
      expect(httpService.postAsync).toHaveBeenCalledWith(
        expect.stringContaining(getOrganisationRoute),
        requestData,
        request
      );
    });

    it("should throw an error if response data structure is invalid", async () => {
      
      const requestData =   { organisationId: organisationId };
      const apiResponse = { data: "Invalid Data Structure" };
      httpService.postAsync.mockResolvedValue(apiResponse);
  
      await expect(
        apiService.getOrganisation(organisationId, request)
      ).rejects.toThrow(unexpectedResponseStructure);
  
      expect(httpService.postAsync).toHaveBeenCalledWith(
        expect.stringContaining(getOrganisationRoute),
        requestData,
        request
      );
    });

    it("should handle unexpected errors gracefully", async () => {
      const requestData =   { organisationId: organisationId };
      httpService.postAsync.mockRejectedValue(new Error(unexpectedErrorMessage));
  
      await expect(
        apiService.getOrganisation(organisationId, request)
      ).rejects.toThrow(unexpectedErrorMessage);
  
      expect(httpService.postAsync).toHaveBeenCalledWith(
        expect.stringContaining(getOrganisationRoute),
        requestData,
        request
      );
    });

  });
});


