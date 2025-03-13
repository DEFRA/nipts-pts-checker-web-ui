import { MicrochipAppPtdMainModel } from "../models/microchipAppPtdMainModel.js";
import dotenv from "dotenv";
import httpService from "./httpService.js";
import { issuingAuthorityModelData } from '../../constants/issuingAuthority.js';
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

const unexpectedErrorText =  "Unexpected error occurred";

const formatDate = (dateRaw) => {
  const date = dateRaw ? new Date(dateRaw) : null;
  return date ? moment(date).format("DD/MM/YYYY") : null;
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

    const item = response?.data;

    if (!item || typeof item !== "object") {
      throw new Error("Unexpected response structure");
    }   

    // Convert application status to lowercase and trim for consistent comparison
    const applicationStatus = item.application.status.toLowerCase().trim();
    const documentState = statusMapping[applicationStatus] || applicationStatus;

    const ptdNumber =
    documentState === "approved" || documentState === "revoked"
      ? item.travelDocument?.travelDocumentReferenceNumber
      : item.application?.referenceNumber;
  

    let issuedDateRaw;

    switch (documentState) {
      case "approved":
        issuedDateRaw = item.application?.dateAuthorised;
        break;
      case "revoked":
        issuedDateRaw = item.application?.dateRevoked;
        break;
      case "rejected":
        issuedDateRaw = item.application?.dateRejected;
        break;
      default:
        issuedDateRaw = item.application?.dateOfApplication;
        break;
    }

    const formattedIssuedDate = formatDate(issuedDateRaw);

    const microchippedDateRaw = item.pet
      ? item.pet.microchippedDate
      : undefined;
    const formattedMicrochippedDate = formatDate(microchippedDateRaw);

    const dateOfBirthRaw = item.pet ? item.pet.dateOfBirth : undefined;
    const formattedDateOfBirth = formatDate(dateOfBirthRaw);

    return getMicrochipAppPtdMainModel(item, documentState, ptdNumber, formattedIssuedDate, microchipNumber, formattedMicrochippedDate, formattedDateOfBirth);


  } catch (error) {
    console.error("Error fetching data:", error.message);

    // Check for specific error message and return a structured error
    if (error.response?.data?.error) {
      if (error.response.data.error === "Application not found" || error.response.data.error === "Pet not found") 
      {
        return { error: "not_found" };
      } 
      else 
      {
        return { error: error.response.data.error };
      }
    }

    return { error: unexpectedErrorText };
  }
};

const checkMicrochipNumberExistWithPtd = async (microchipNumber, request) => {
  try {
    const response = await httpService.postAsync(
      `${baseUrl}/Checker/checkMicrochipNumberExistWithPtd`,
      { microchipNumber },
      request
    );

    // The API returns a boolean value
    const exists = response?.data;

    return { exists };
  } catch (error) {
    console.error("Error checking microchip number existence:", error.message);

    // Handle specific errors if needed
    if (error.response?.data) {
      return {
        error: error.response.data.error || unexpectedErrorText,
      };
    }

    return { error: unexpectedErrorText };
  }
};

// Export the new function
export default {
  getMicrochipData,
  checkMicrochipNumberExistWithPtd,
};

function getMicrochipAppPtdMainModel(item, documentState, ptdNumber, formattedIssuedDate, microchipNumber, formattedMicrochippedDate, formattedDateOfBirth) {
  const getValue = (obj, key, fallback = null) => obj?.[key] ?? fallback;

  const pet = item.pet || {};
  const application = item.application || {};
  const travelDocument = item.travelDocument || {};
  const petOwner = item.petOwner || {};

  return new MicrochipAppPtdMainModel({
    petId: getValue(pet, "petId"),
    petName: getValue(pet, "petName"),
    petSpecies: getValue(pet, "species"),
    petBreed: pet.breedName === "Mixed breed or unknown" && pet.breedAdditionalInfo ? pet.breedAdditionalInfo : getValue(pet, "breedName"),
    documentState,
    ptdNumber,
    issuedDate: formattedIssuedDate,
    microchipNumber,
    microchipDate: formattedMicrochippedDate,
    petSex: getValue(pet, "sex"),
    petDoB: formattedDateOfBirth,
    petColour: getValue(pet, "colourName"),
    petFeaturesDetail: getValue(pet, "significantFeatures"),
    applicationId: getValue(application, "applicationId"),
    travelDocumentId: getValue(travelDocument, "travelDocumentId"),
    dateOfIssue: getValue(travelDocument, "dateOfIssue"),
    petOwnerName: getValue(petOwner, "name"),
    petOwnerEmail: getValue(petOwner, "email"),
    petOwnerTelephone: getValue(petOwner, "telephone"),
    petOwnerAddress: getValue(petOwner, "address"),
    issuingAuthority: issuingAuthorityModelData,
  });
}
