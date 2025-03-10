process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { HttpStatusCode } from "axios";
import { organisationMainModel } from "../models/organisationMainModel.js";
import { MicrochipAppPtdMainModel } from "../models/microchipAppPtdMainModel.js";
import httpService from "./httpService.js";
import { issuingAuthorityModelData } from "../../constants/issuingAuthority.js";
import moment from "moment";

const errorText = "Error fetching data:";

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
const unexpectedErrorText = "Unexpected error occurred";
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
    validateItem(item);

    const { documentState, ptdNumber, issuedDateRaw, microchippedDateRaw, dateOfBirthRaw } = getDocumentAndDateData(item);

    const formattedIssuedDate = formatDate(issuedDateRaw);
    const formattedMicrochippedDate = formatDate(microchippedDateRaw);
    const formattedDateOfBirth = formatDate(dateOfBirthRaw);

    const transformedItem = new MicrochipAppPtdMainModel({
      petId: item.pet?.petId,
      petName: item.pet?.petName,
      petSpecies: item.pet?.species,
      petBreed: getPetBreed(item),
      documentState,
      ptdNumber,
      issuedDate: formattedIssuedDate || undefined,
      microchipNumber: item.pet?.microchipNumber,
      microchipDate: formattedMicrochippedDate || undefined,
      petSex: item.pet?.sex,
      petDoB: formattedDateOfBirth || undefined,
      petColour: item.pet?.colourName,
      petFeaturesDetail: item.pet?.significantFeatures,
      applicationId: item.application?.applicationId,
      travelDocumentId: item.travelDocument?.travelDocumentId,
      dateOfIssue: item.travelDocument?.dateOfIssue,
      petOwnerName: item.petOwner?.name,
      petOwnerEmail: item.petOwner?.email,
      petOwnerTelephone: item.petOwner?.telephone,
      petOwnerAddress: item.petOwner?.address || null,
      issuingAuthority: issuingAuthorityModelData,
    });

    return transformedItem;
  } catch (error) {
    console.error(errorText, error.message);
    return handleError(error);
  }
};

function validateItem(item) {
  if (!item || typeof item !== "object") {
    throw new Error(unexpectedResponseErrorText);
  }

  if (!item.pet) {
    throw new Error(petNotFoundErrorText);
  }

  if (!item.application) {
    throw new Error(applicationNotFoundErrorText);
  }

  if (!item.travelDocument) {
    throw new Error("TravelDocument not found");
  }
}

function getDocumentAndDateData(item) {
  const applicationStatus = item.application.status.toLowerCase().trim();
  const documentState = statusMapping[applicationStatus] || applicationStatus;

  const ptdNumber =
    documentState === "approved" || documentState === "revoked"
      ? item?.travelDocument?.travelDocumentReferenceNumber
      : item?.application?.referenceNumber;

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

  const microchippedDateRaw = item.pet?.microchippedDate;
  const dateOfBirthRaw = item.pet?.dateOfBirth;

  return { documentState, ptdNumber, issuedDateRaw, microchippedDateRaw, dateOfBirthRaw };
}

function getPetBreed(item) {
  return item.pet?.breedName === "Mixed breed or unknown" && item.pet?.additionalBreedInfo
    ? item.pet.additionalBreedInfo
    : item.pet?.breedName;
}

function handleError(error) {
  if (error?.message) {
    const errorMapping = {
      [applicationNotFoundErrorText]: applicationNotFoundErrorText,
      [petNotFoundErrorText]: petNotFoundErrorText,
    };
  
    return { error: errorMapping[error.message] || error.message };
  }
  
  return { error: unexpectedErrorText };
}

function getMicrochipAppPtdMainModel({pet, application, travelDocument, petOwner, documentState, ptdNumber, formattedIssuedDate, formattedMicrochippedDate, formattedDateOfBirth}) {
  const getSafeValue = (obj, key, fallback = null) => obj?.[key] ?? fallback;

  
  return new MicrochipAppPtdMainModel({
    petId: getSafeValue(pet, "petId"),
    petName: getSafeValue(pet, "petName"),
    petSpecies: getSafeValue(pet, "species"),
    petBreed: pet.breedName === "Mixed breed or unknown" && pet.breedAdditionalInfo
      ? pet.breedAdditionalInfo
      : getSafeValue(pet, "breedName"),
    documentState,
    ptdNumber,
    issuedDate: formattedIssuedDate || undefined,
    microchipNumber: getSafeValue(pet, "microchipNumber"),
    microchipDate: formattedMicrochippedDate || undefined,
    petSex: getSafeValue(pet, "sex"),
    petDoB: formattedDateOfBirth || undefined,
    petColour: getSafeValue(pet, "colourName"),
    petFeaturesDetail: getSafeValue(pet, "significantFeatures"),
    applicationId: getSafeValue(application, "applicationId"),
    travelDocumentId: getSafeValue(travelDocument, "travelDocumentId"),
    dateOfIssue: getSafeValue(travelDocument, "dateOfIssue"),
    petOwnerName: getSafeValue(petOwner, "name"),
    petOwnerEmail: getSafeValue(petOwner, "email"),
    petOwnerTelephone: getSafeValue(petOwner, "telephone"),
    petOwnerAddress: getSafeValue(petOwner, "address"),
    issuingAuthority: issuingAuthorityModelData,
  });
}

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

    const pet = item.pet || {};
    const application = item.application || {};
    const travelDocument = item.travelDocument || {};
    const petOwner = item.petOwner || {};

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
        ? item?.travelDocument?.travelDocumentReferenceNumber
        : item?.application?.referenceNumber;

    let issuedDateRaw;

    switch (documentState) {
      case "approved":
        issuedDateRaw = item?.application?.dateAuthorised;
        break;
      case "revoked":
        issuedDateRaw = item?.application?.dateRevoked;
        break;
      case "rejected":
        issuedDateRaw = item?.application?.dateRejected;
        break;
      default:
        issuedDateRaw = item?.application?.dateOfApplication;
        break;
    }

    const formattedIssuedDate = formatDate(issuedDateRaw);

    const microchippedDateRaw = item.pet
      ? item.pet.microchippedDate
      : undefined;
    const formattedMicrochippedDate = formatDate(microchippedDateRaw);

    const dateOfBirthRaw = item.pet ? item.pet.dateOfBirth : undefined;
    const formattedDateOfBirth = formatDate(dateOfBirthRaw);
    

    return getMicrochipAppPtdMainModel({pet, application, travelDocument, petOwner, documentState, ptdNumber, formattedIssuedDate, formattedMicrochippedDate, formattedDateOfBirth});
     
  } catch (error) {
    console.error(errorText, error.message);

    if (error?.message) {
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
    console.error(errorText, error.message);

    // Check for specific error message and return a structured error
    if (error?.message) {
      if (error.message === applicationNotFoundErrorText) {
        return { error: "not_found" };
      } else {
        return { error: error.message };
      }
    }
    return { error: unexpectedErrorText };
  }
};

const reportNonCompliance = async (checkOutcome, request) => {
  try {
    const data = checkOutcome;
    const url = buildApiUrl("Checker/ReportNonCompliance");
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
    console.error(errorText, error.message);

    // Check for specific error message and return a structured error
    if (error?.message) {
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
    console.error(errorText, error.message);

    // Check for specific error message and return a structured error
    if (error?.message) {
      return { error: error.message };
    }

    return { error: unexpectedErrorText };
  }
};

const getOrganisation = async (organisationId, request) => {
  try {
    const data =   { organisationId: organisationId };
    const url = buildApiUrl("Checker/getOrganisation");
    const response = await httpService.postAsync(url, data, request);

    // Check for errors in the response
    if (response?.error) {
      return { error: response.error };
    }

    const organisationResposne = response.data;
    if (!organisationResposne || typeof organisationResposne !== "object") {
      throw new Error(unexpectedResponseErrorText);
    }

    // Map each item to OrganisationMainModel
    const organisation = organisationMainModel({
        Id: organisationResposne.id,
        Name: organisationResposne.name,
        Location: organisationResposne.location,
        ExternalId: organisationResposne.externalId, 
        ActiveFrom: organisationResposne.activeFrom,
        ActiveTo: organisationResposne.activeTo,
        IsActive: organisationResposne.isActive,
      });

    return organisation;
  } catch (error) {
    console.error(errorText, error.message);

    throw error;
  }
};


export default {
  getApplicationByPTDNumber,
  getApplicationByApplicationNumber,
  recordCheckOutCome,
  reportNonCompliance,
  saveCheckerUser,
  getOrganisation
};