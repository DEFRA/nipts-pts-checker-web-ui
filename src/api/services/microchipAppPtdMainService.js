import { MicrochipAppPtdMainModel } from "../models/microchipAppPtdMainModel.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const baseUrl = process.env.BASE_API_URL || "https://devptswebaw1003.azurewebsites.net/api";

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

const getMicrochipData = async (microchipNumber) => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/Checker/checkMicrochipNumber`,
      { microchipNumber }
    );

    const item = response.data;

    if (!item || typeof item !== "object") {
      throw new Error("Unexpected response structure");
    }

    // Ensure the item structure is as expected
    if (!item.Pet) {
      return { error: "Pet not found" };
    }

    if (!item.Application) {
      return { error: "Application not found" };
    }

    // Convert application status to lowercase and trim for consistent comparison
    const applicationStatus = item.Application.Status.toLowerCase().trim();
    const documentState = statusMapping[applicationStatus] || applicationStatus;

    const ptdNumber =
      documentState === "approved" || documentState === "revoked"
        ? item.TravelDocument &&
          item.TravelDocument.TravelDocumentReferenceNumber
        : item.Application && item.Application.ReferenceNumber;

    const issuedDate =
      documentState === "approved" || documentState === "revoked"
        ? item.TravelDocument && item.TravelDocument.TravelDocumentDateOfIssue
        : item.Application && item.Application.DateOfApplication;

    const transformedItem = new MicrochipAppPtdMainModel({
      petId: item.Pet ? item.Pet.PetId : undefined,
      petName: item.Pet ? item.Pet.PetName : undefined,
      petSpecie: item.Pet ? item.Pet.Species : undefined,
      petBreed: item.Pet ? item.Pet.BreedName : undefined,
      documentState,
      ptdNumber,
      issuedDate,
      microchipDate: item.Pet ? item.Pet.MicrochippedDate : undefined,
      petSex: item.Pet ? item.Pet.Sex : undefined,
      petDoB: item.Pet ? item.Pet.DateOfBirth : undefined,
      petColour: item.Pet ? item.Pet.ColourName : undefined,
      petFeaturesDetail: item.Pet ? item.Pet.SignificantFeatures : undefined,
      applicationId: item.Application
        ? item.Application.ApplicationId
        : undefined,
      travelDocumentId: item.TravelDocument
        ? item.TravelDocument.TravelDocumentId
        : null,
      dateOfIssue: item.TravelDocument ? item.TravelDocument.DateOfIssue : null,
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
