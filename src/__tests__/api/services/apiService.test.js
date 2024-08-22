import apiService from "../../../api/services/apiService.js";
import httpService from "../../../api/services/httpService.js";
import { HttpStatusCode } from "axios";
import moment from "moment";
import { MicrochipAppPtdMainModel } from "../../../api/models/microchipAppPtdMainModel.js";

jest.mock("../../../api/services/httpService.js");
jest.mock("axios");
jest.mock("moment");

const baseUrl =
  process.env.BASE_API_URL || "https://devptswebaw1003.azurewebsites.net/api";

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
            dateOfIssue: "2023-02-01",
          },
        },
      };

      httpService.postAsync.mockResolvedValue({
        status: 200,
        data: mockResponse.data,
      });
      moment.mockImplementation((date) => ({
        format: () => "01/01/2022",
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
        issuedDate: "01/01/2022",
        microchipNumber: "123456789",
        microchipDate: "01/01/2022",
        petSex: "Male",
        petDoB: "01/01/2022",
        petColour: "Brown",
        petFeaturesDetail: "None",
        applicationId: "app123",
        travelDocumentId: "td123",
        dateOfIssue: "2023-02-01",
      });

      expect(result).toEqual(expectedInstance);
    });

    it("should return error when PTD number is not found", async () => {
      httpService.postAsync.mockResolvedValue({
        status: 404,
        error: "Application not found",
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
      expect(result).toEqual({ error: "Application not found" });
    });

    it("should return unexpected error when an exception occurs", async () => {
      httpService.postAsync.mockRejectedValue(new Error("Unexpected error"));

      const result = await apiService.getApplicationByPTDNumber(
        "123456",
        request
      );
      expect(result).toEqual({ error: "Unexpected error" });
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
            dateOfIssue: "2023-02-01",
          },
        },
      };

      httpService.postAsync.mockResolvedValue({
        status: 200,
        data: mockResponse.data,
      });
      moment.mockImplementation((date) => ({
        format: () => "01/01/2022",
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
        issuedDate: "01/01/2022",
        microchipNumber: "123456789",
        microchipDate: "01/01/2022",
        petSex: "Male",
        petDoB: "01/01/2022",
        petColour: "Brown",
        petFeaturesDetail: "None",
        applicationId: "app123",
        travelDocumentId: "td123",
        dateOfIssue: "2023-02-01",
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
            dateOfIssue: "2023-02-01",
          },
        },
      };

      httpService.postAsync.mockResolvedValue({
        status: 200,
        data: mockResponse.data,
      });
      moment.mockImplementation((date) => ({
        format: () => "01/01/2022",
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
        microchipDate: "01/01/2022",
        petSex: "Male",
        petDoB: "01/01/2022",
        petColour: "Brown",
        petFeaturesDetail: "None",
        applicationId: "app123",
        travelDocumentId: "td123",
        dateOfIssue: "2023-02-01",
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
            dateOfIssue: "2023-02-01",
          },
        },
      };

      httpService.postAsync.mockResolvedValue({
        status: 200,
        data: mockResponse.data,
      });
      moment.mockImplementation((date) => ({
        format: () => "01/01/2022",
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
        microchipDate: "01/01/2022",
        petSex: "Male",
        petDoB: "01/01/2022",
        petColour: "Brown",
        petFeaturesDetail: "None",
        applicationId: "app123",
        travelDocumentId: "td123",
        dateOfIssue: "2023-02-01",
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
            dateOfIssue: "2023-02-01",
          },
        },
      };

      httpService.postAsync.mockResolvedValue({
        status: 200,
        data: mockResponse.data,
      });
      moment.mockImplementation((date) => ({
        format: () => "01/01/2022",
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
        microchipDate: "01/01/2022",
        petSex: "Male",
        petDoB: "01/01/2022",
        petColour: "Brown",
        petFeaturesDetail: "None",
        applicationId: "app123",
        travelDocumentId: "td123",
        dateOfIssue: "2023-02-01",
      });

      expect(result).toEqual(expectedInstance);
    });


    it("should return error when application number is not found", async () => {
      httpService.postAsync.mockResolvedValue({
        status: 404,
        error: "Application not found",
      });

      const result = await apiService.getApplicationByApplicationNumber(
        "app123",
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

      const result = await apiService.getApplicationByApplicationNumber(
        "app123",
        request
      );
      expect(result).toEqual({ error: "Application not found" });
    });

    it("should return unexpected error when an exception occurs", async () => {
      httpService.postAsync.mockRejectedValue(new Error("Unexpected error"));

      const result = await apiService.getApplicationByApplicationNumber(
        "app123",
        request
      );
      expect(result).toEqual({ error: "Unexpected error" });
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

      expect(result).toEqual({ error: "Unexpected response structure" });
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

      expect(result).toEqual({ error: "Unexpected response structure" });
    });
  });
});
