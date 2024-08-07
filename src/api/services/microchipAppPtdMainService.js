import { MicrochipAppPtdMainModel } from "../models/microchipAppPtdMainModel.js";
import dotenv from "dotenv";
import httpService from "./httpService.js";
import moment from "moment";

dotenv.config();

const baseUrl =
  process.env.BASE_API_URL || "https://devptswebaw1003.azurewebsites.net/api";

if (!baseUrl) {
  throw new Error("BASE_API_URL is not set in environment variables.");
}

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

const getMicrochipData = async (microchipNumber, request) => {
  try {
    const response = await httpService.postAsync(
      `${baseUrl}/Checker/checkMicrochipNumber`,
      { microchipNumber },
      request
    );

    // Ensure the item structure is as expected
    if (response?.error?.error) {
      return { error: "not_found" };
    }

    if (response?.error?.error) {
      return { error: "not_found" };
    }

    const item = response?.data;

    if (!item || typeof item !== "object") {
      throw new Error("Unexpected response structure");
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
      issuedDate: formattedIssuedDate ? formattedIssuedDate : undefined,
      microchipNumber,
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
    if (error.response && error.response.data && error.response.data.error) {
      if (
        error.response.data.error === "Application not found" ||
        error.response.data.error === "Pet not found"
      ) {
        return { error: "not_found" };
      } else {
        return { error: error.response.data.error };
      }
    }

    return { error: "Unexpected error occurred" };
  }
};

export default {
  getMicrochipData,
};
