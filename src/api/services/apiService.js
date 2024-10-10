process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { HttpStatusCode } from "axios";
import { MicrochipAppPtdMainModel } from "../models/microchipAppPtdMainModel.js";
import httpService from "./httpService.js";
import { issuingAuthorityModelData } from '../../constants/issuingAuthority.js';
import moment from "moment";

const buildApiUrl = (endpoint) => {
  let baseUrl =
    process.env.BASE_API_URL || "https://devptswebaw1003.azurewebsites.net/api";

  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.substring(0, baseUrl.length - 1);
  }

  let apiEndpoint = `${endpoint}`;
  if (apiEndpoint.startsWith("/")) {
    apiEndpoint = apiEndpoint.substring(1);
  }

  return `${baseUrl}/${apiEndpoint}`;
};

// Status mapping with lowercase keys and spaces
const statusMapping = {
  authorised: "approved",
  "awaiting verification": "awaiting",
  rejected: "rejected",
  revoked: "revoked",
};

const unexpectedResponseErrorText = "Unexpected response structure";
const unexpectedErrorText =  "Unexpected error occurred";
const petNotFoundErrorText = "Pet not found";
const applicationNotFoundErrorText = "Application not found";

const formatDate = (dateRaw) => {
  const date = dateRaw ? new Date(dateRaw) : null;
  return date ? moment(date).format("DD/MM/YYYY") : undefined;
};

const getApplicationByPTDNumber = async (ptdNumberFromPayLoad, request) => {
  try {
    const data = { ptdNumber: ptdNumberFromPayLoad };
    const url = buildApiUrl("Checker/checkPTDNumber");
    const response = await httpService.postAsync(url, data, request);

    if (response.status === HttpStatusCode.NotFound) {
      throw new Error(response.error);
    }

    const item = response.data;

    if (!item || typeof item !== "object") {
      throw new Error(unexpectedResponseErrorText);
    }

    // Ensure the item structure is as expected
    if (!item.pet) {
      return { error: petNotFoundErrorText };
    }

    if (!item.application) {
      return { error: applicationNotFoundErrorText };
    }

    if (!item.travelDocument) {
      return { error: "TravelDocument not found" };
    }

    // Convert application status to lowercase and trim for consistent comparison
    const applicationStatus = item.application.status.toLowerCase().trim();
    const documentState = statusMapping[applicationStatus] || applicationStatus;

    const ptdNumber =
      documentState === "approved" || documentState === "revoked"
        ? item.travelDocument &&
          item.travelDocument.travelDocumentReferenceNumber
        : item.application && item.application.referenceNumber;

    let issuedDateRaw;

    switch (documentState) {
      case "approved":
        issuedDateRaw = item.application && item.application.dateAuthorised;
        break;
      case "revoked":
        issuedDateRaw = item.application && item.application.dateRevoked;
        break;
      case "rejected":
        issuedDateRaw = item.application && item.application.dateRejected;
        break;
      default:
        issuedDateRaw = item.application && item.application.dateOfApplication;
        break;
    }

    const formattedIssuedDate = formatDate(issuedDateRaw);

    const microchippedDateRaw = item.pet
      ? item.pet.microchippedDate
      : undefined;
    const formattedMicrochippedDate = formatDate(microchippedDateRaw);

    const dateOfBirthRaw = item.pet ? item.pet.dateOfBirth : undefined;
    const formattedDateOfBirth = formatDate(dateOfBirthRaw);

    const transformedItem = new MicrochipAppPtdMainModel({
      petId: item.pet ? item.pet.petId : undefined,
      petName: item.pet ? item.pet.petName : undefined,
      petSpecies: item.pet ? item.pet.species : undefined,
      petBreed: item.pet ? item.pet.breedName : undefined,
      documentState,
      ptdNumber,
      issuedDate: formattedIssuedDate || undefined,
      microchipNumber: item.pet ? item.pet.microchipNumber : undefined,
      microchipDate: formattedMicrochippedDate || undefined,
      petSex: item.pet ? item.pet.sex : undefined,
      petDoB: formattedDateOfBirth || undefined,
      petColour: item.pet ? item.pet.colourName : undefined,
      petFeaturesDetail: item.pet ? item.pet.significantFeatures : undefined,
      applicationId: item.application
        ? item.application.applicationId
        : undefined,
      travelDocumentId: item.travelDocument
        ? item.travelDocument.travelDocumentId
        : null,
      dateOfIssue: item.travelDocument ? item.travelDocument.dateOfIssue : null,
      petOwnerName: item.petOwner ? item.petOwner.name : null,
      petOwnerEmail: item.petOwner ? item.petOwner.email : null,
      petOwnerTelephone: item.petOwner ? item.petOwner.telephone : null,
      petOwnerAddress: item.petOwner.address ? item.petOwner.address : null,
      issuingAuthority: issuingAuthorityModelData,
    });

    return transformedItem;
  } catch (error) {
    console.error("Error fetching data:", error.message);

    // Check for specific error message and return a structured error
    if (error && error.message) {
      if (
        error.message === applicationNotFoundErrorText ||
        error.message ===  petNotFoundErrorText
      ) {
        return { error: "not_found" };
      } else {
        return { error: error.message };
      }
    }

    return { error: unexpectedErrorText };
  }
};

const getApplicationByApplicationNumber = async (
  applicationNumber,
  request
) => {
  try {
    const data = { applicationNumber: applicationNumber };
    const url = buildApiUrl("Checker/checkApplicationNumber");
    const response = await httpService.postAsync(url, data, request);

    if (response.status === HttpStatusCode.NotFound) {
      throw new Error(response.error);
    }

    const item = response.data;

    if (!item || typeof item !== "object") {
      throw new Error(unexpectedResponseErrorText);
    }

    // Ensure the item structure is as expected
    if (!item.pet) {
      return { error: petNotFoundErrorText };
    }

    if (!item.application) {
      return { error: applicationNotFoundErrorText };
    }

    if (!item.travelDocument) {
      return { error: "TravelDocument not found" };
    }

    // Convert application status to lowercase and trim for consistent comparison
    const applicationStatus = item.application.status.toLowerCase().trim();
    const documentState = statusMapping[applicationStatus] || applicationStatus;

    const ptdNumber =
      documentState === "approved" || documentState === "revoked"
        ? item.travelDocument &&
          item.travelDocument.travelDocumentReferenceNumber
        : item.application && item.application.referenceNumber;

    let issuedDateRaw;

    switch (documentState) {
      case "approved":
        issuedDateRaw = item.application && item.application.dateAuthorised;
        break;
      case "revoked":
        issuedDateRaw = item.application && item.application.dateRevoked;
        break;
      case "rejected":
        issuedDateRaw = item.application && item.application.dateRejected;
        break;
      default:
        issuedDateRaw = item.application && item.application.dateOfApplication;
        break;
    }

    const formattedIssuedDate = formatDate(issuedDateRaw);

    const microchippedDateRaw = item.pet
      ? item.pet.microchippedDate
      : undefined;
    const formattedMicrochippedDate = formatDate(microchippedDateRaw);

    const dateOfBirthRaw = item.pet ? item.pet.dateOfBirth : undefined;
    const formattedDateOfBirth = formatDate(dateOfBirthRaw);

    const transformedItem = new MicrochipAppPtdMainModel({
      petId: item.pet ? item.pet.petId : undefined,
      petName: item.pet ? item.pet.petName : undefined,
      petSpecies: item.pet ? item.pet.species : undefined,
      petBreed: item.pet ? item.pet.breedName : undefined,
      documentState,
      ptdNumber,
      issuedDate: formattedIssuedDate || undefined,
      microchipNumber: item.pet ? item.pet.microchipNumber : undefined,
      microchipDate: formattedMicrochippedDate || undefined,
      petSex: item.pet ? item.pet.sex : undefined,
      petDoB: formattedDateOfBirth || undefined,
      petColour: item.pet ? item.pet.colourName : undefined,
      petFeaturesDetail: item.pet ? item.pet.significantFeatures : undefined,
      applicationId: item.application
        ? item.application.applicationId
        : undefined,
      travelDocumentId: item.travelDocument
        ? item.travelDocument.travelDocumentId
        : null,
      dateOfIssue: item.travelDocument ? item.travelDocument.dateOfIssue : null,
      petOwnerName: item.petOwner ? item.petOwner.name : null,
      petOwnerEmail: item.petOwner ? item.petOwner.email : null,
      petOwnerTelephone: item.petOwner ? item.petOwner.telephone : null,
      petOwnerAddress: item.petOwner.address ? item.petOwner.address : null,
      issuingAuthority: issuingAuthorityModelData,
    });

    return transformedItem;
  } catch (error) {
    console.error("Error fetching data:", error.message);

    if (error && error.message) {
      if (
        error.message === applicationNotFoundErrorText ||
        error.message === petNotFoundErrorText
      ) {
        return { error: "not_found" };
      } else {
        return { error: error.message };
      }
    }

    return { error: unexpectedErrorText };
  }
};

const recordCheckOutCome = async (checkOutcome, request) => {
  try {
    const data = checkOutcome;
    const url = buildApiUrl("Checker/CheckOutcome");
    const response = await httpService.postAsync(url, data, request);

    if (response.status === HttpStatusCode.NotFound) {
      throw new Error(response.error);
    }

    const item = response.data;
    if (!item || typeof item !== "object") {
      throw new Error(unexpectedResponseErrorText);
    }

    return item.checkSummaryId;
  } catch (error) {
    console.error("Error fetching data:", error.message);

    // Check for specific error message and return a structured error
    if (error && error.message) {
      if (error.message === applicationNotFoundErrorText) {
        return { error: "not_found" };
      } else {
        return { error: error.message };
      }
    }
    return { error: unexpectedErrorText };
  }
};

const saveCheckerUser = async (checker, request) => {
  try {
    const data = checker;
    const url = buildApiUrl("Checker/CheckerUser");
    const response = await httpService.postAsync(url, data, request);

    const checkerId = response.data;
    if (!checkerId || typeof checkerId !== "object") {
      throw new Error(unexpectedResponseErrorText);
    }

    return checkerId;
  } catch (error) {
    console.error("Error fetching data:", error.message);

    // Check for specific error message and return a structured error
    if (error?.message) {
        return { error: error.message };
    }

    return { error: unexpectedErrorText };
  }
};

export default {
  getApplicationByPTDNumber,
  getApplicationByApplicationNumber,
  recordCheckOutCome,
  saveCheckerUser
};
