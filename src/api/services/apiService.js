process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { HttpStatusCode } from "axios";
import { MicrochipAppPtdMainModel } from "../models/microchipAppPtdMainModel.js";
import httpService from "./httpService.js";
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

const formatDate = (dateRaw) => {
  const date = dateRaw ? new Date(dateRaw) : null;
  return date ? moment(date).format("DD/MM/YYYY") : undefined;
};

const getApplicationByPTDNumber = async (ptdNumberFromPayLoad) => {
  try {
    const data = { ptdNumber: ptdNumberFromPayLoad };
    const url = buildApiUrl("Checker/checkPTDNumber");
    var response = await httpService.postAsync(url, data);

    if (response.status == HttpStatusCode.NotFound) {
      throw new Error(response.error);
    }

    const item = response.data;

    if (!item || typeof item !== "object") {
      throw new Error("Unexpected response structure");
    }

    // Ensure the item structure is as expected
    if (!item.pet) {
      return { error: "Pet not found" };
    }

    if (!item.application) {
      return { error: "Application not found" };
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
      petSpecie: item.pet ? item.pet.species : undefined,
      petBreed: item.pet ? item.pet.breedName : undefined,
      documentState,
      ptdNumber,
      issuedDate: formattedIssuedDate ? formattedIssuedDate : undefined,
      microchipNumber: item.pet ? item.pet.microchipNumber : undefined,
      microchipDate: formattedMicrochippedDate
        ? formattedMicrochippedDate
        : undefined,
      petSex: item.pet ? item.pet.sex : undefined,
      petDoB: formattedDateOfBirth ? formattedDateOfBirth : undefined,
      petColour: item.pet ? item.pet.colourName : undefined,
      petFeaturesDetail: item.pet ? item.pet.significantFeatures : undefined,
      applicationId: item.application
        ? item.application.applicationId
        : undefined,
      travelDocumentId: item.travelDocument
        ? item.travelDocument.travelDocumentId
        : null,
      dateOfIssue: item.travelDocument ? item.travelDocument.dateOfIssue : null,
    });

    return transformedItem;
  } catch (error) {
    console.error("Error fetching data:", error.message);

    // Check for specific error message and return a structured error
    if (error && error.message) {
      if (
        error.message === "Application not found" ||
        error.message === "Pet not found"
      ) {
        return { error: "not_found" };
      } else {
        return { error: error.message };
      }
    }

    return { error: "Unexpected error occurred" };
  }
};

const getApplicationByApplicationNumber = async (
  applicationNumber
) => {
  try {
    const data = { applicationNumber: applicationNumber };
    const url = buildApiUrl("Checker/checkApplicationNumber");
    var response = await httpService.postAsync(url, data);

    if (response.status == HttpStatusCode.NotFound) {
      throw new Error(response.error);
    }

    const item = response.data;

    if (!item || typeof item !== "object") {
      throw new Error("Unexpected response structure");
    }

    // Ensure the item structure is as expected
    if (!item.pet) {
      return { error: "Pet not found" };
    }

    if (!item.application) {
      return { error: "Application not found" };
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
      petSpecie: item.pet ? item.pet.species : undefined,
      petBreed: item.pet ? item.pet.breedName : undefined,
      documentState,
      ptdNumber,
      issuedDate: formattedIssuedDate ? formattedIssuedDate : undefined,
      microchipNumber: item.pet ? item.pet.microchipNumber : undefined,
      microchipDate: formattedMicrochippedDate
        ? formattedMicrochippedDate
        : undefined,
      petSex: item.pet ? item.pet.sex : undefined,
      petDoB: formattedDateOfBirth ? formattedDateOfBirth : undefined,
      petColour: item.pet ? item.pet.colourName : undefined,
      petFeaturesDetail: item.pet ? item.pet.significantFeatures : undefined,
      applicationId: item.application
        ? item.application.applicationId
        : undefined,
      travelDocumentId: item.travelDocument
        ? item.travelDocument.travelDocumentId
        : null,
      dateOfIssue: item.travelDocument ? item.travelDocument.dateOfIssue : null,
    });

    return transformedItem;
  } catch (error) {
    console.error("Error fetching data:", error.message);

    if (error && error.message) {
      if (
        error.message === "Application not found" ||
        error.message === "Pet not found"
      ) {
        return { error: "not_found" };
      } else {
        return { error: error.message };
      }
    }

    return { error: "Unexpected error occurred" };
  }
};

export default {
  getApplicationByPTDNumber,
  getApplicationByApplicationNumber,
};
