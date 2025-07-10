import { HttpStatusCode } from "axios";
import { MicrochipAppPtdMainModel } from "../models/microchipAppPtdMainModel.js";
import dotenv from "dotenv";
import httpService from "./httpService.js";
import { issuingAuthorityModelData } from '../../constants/issuingAuthority.js';
import moment from "moment";
import { getIssueDateByDocState, getPtdNumberByDocState, handleNotFoundError } from "../../helper/service-helper.js";

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
const petNotFoundErrorText = "Pet not found";
const applicationNotFoundErrorText = "Application not found";

const formatDate = (dateRaw) => {
  const date = dateRaw ? new Date(dateRaw) : null;
  return date ? moment(date).format("DD/MM/YYYY") : null;
};

function getValueAttributeOrUndefined(value, attribute) {
  return value ? value[attribute] : undefined
}

const getMicrochipData = async (microchipNumber, request) => {
  try {
    const response = await httpService.postAsync(
      `${baseUrl}/Checker/checkMicrochipNumber`,
      { microchipNumber },
      request
    );

     if (response.status === HttpStatusCode.NotFound && response?.error?.error) {
            return handleNotFoundError(response.error.error, applicationNotFoundErrorText, petNotFoundErrorText);
    }

    
    if (!response || response.status !== HttpStatusCode.Ok || response.data === undefined) 
    {
      throw new Error(`API Error: ${response?.status}`);
    }

    const item = response?.data;

    if (!item || typeof item !== "object") {
      throw new Error("Unexpected response structure");
    }   

    // Convert application status to lowercase and trim for consistent comparison
    const applicationStatus = item.application.status.toLowerCase().trim();
    const documentState = statusMapping[applicationStatus] || applicationStatus;

    const ptdNumber = getPtdNumberByDocState(documentState, item)
  
    const issuedDateRaw = getIssueDateByDocState(documentState, item)
    const formattedIssuedDate = formatDate(issuedDateRaw);
    const microchippedDateRaw = getValueAttributeOrUndefined(item.pet, 'microchippedDate')
    const formattedMicrochippedDate = formatDate(microchippedDateRaw);
    const dateOfBirthRaw = getValueAttributeOrUndefined(item.pet, 'dateOfBirth');
    const formattedDateOfBirth = formatDate(dateOfBirthRaw);

    const suspendedResponse = await httpService.postAsync(
      `${baseUrl}/Checker/GetIsUserSuspendedStatusByEmail`,
      item.petOwner.email,
      request
    );
    const isUserSuspended = suspendedResponse?.data;

    return getMicrochipAppPtdMainModel(item, documentState, ptdNumber, formattedIssuedDate, microchipNumber, formattedMicrochippedDate, formattedDateOfBirth, isUserSuspended);


  } catch (error) {
    global.appInsightsClient.trackException({ exception: error });
    console.error("Error fetching data:", error.message);
    throw error;
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
    global.appInsightsClient.trackException({ exception: error });
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

function getMicrochipAppPtdMainModel(item, documentState, ptdNumber, formattedIssuedDate, microchipNumber, formattedMicrochippedDate, formattedDateOfBirth, isUserSuspended) {
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
    isUserSuspended: isUserSuspended
  });
}
