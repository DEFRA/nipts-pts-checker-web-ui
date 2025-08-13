import { SpsReferralMainModel } from "../models/spsReferralMainModel.js";
import dotenv from "dotenv";
import httpService from "./httpService.js";
import moment from "moment";


dotenv.config();

const baseUrl =
  process.env.BASE_API_URL || "https://devptswebaw1003.azurewebsites.net/api";

if (!baseUrl) {
  throw new Error("BASE_API_URL is not set in environment variables.");
}

const getSpsReferrals = async (route, date, timeWindowInHours, request) => {
  const SailingDate = moment(date).toISOString();
  try {
    const response = await httpService.postAsync(
      `${baseUrl}/Checker/getSpsCheckDetailsByRoute`,
      { route, SailingDate, timeWindowInHours },
      request
    );

    // Check for errors in the response
    if (response?.error) {
      return { error: response.error };
    }

    const items = response?.data;

    if (!Array.isArray(items)) {
      throw new Error("Unexpected response structure");
    }

    // Map each item to SpsReferralMainModel
    const referralItems = items.map((item) => {
      return new SpsReferralMainModel({
        PTDNumber: item.ptdNumber,
        PetDescription: item.petDescription,
        Microchip: item.microchip,
        TravelBy: item.travelBy,
        SPSOutcome: item.spsOutcome,
        CheckSummaryId: item.checkSummaryId,
        PassengerTypeId: item.passengerTypeId,
      });
    });

    return referralItems;
  } catch (error) {
    global.appInsightsClient.trackException({ exception: error });
    console.error("Error in getCheckOutcomes:", error);
    throw error;
  }
};


const getCompleteCheckDetails = async (checkSummaryId, request) => {
  try {
    const response = await httpService.postAsync(
      `${baseUrl}/Checker/getCompleteCheckDetails`,
      { checkSummaryId: checkSummaryId },
      request
    );

    if (response?.error) {
      throw new Error(response.error);
    }

    return response?.data || null;
  } catch (error) {
    global.appInsightsClient.trackException({ exception: error });
    console.error("Error in getCompleteCheckDetails:", error);
    throw error;
  }
};

const updateCheckOutcomeSps = async (checkSummaryId, checkOutcome, checkOutcomeDetails, request) => {
  try {
    const response = await httpService.postAsync(
      `${baseUrl}/Checker/updateCheckOutcomeSps`,
      { checkSummaryId: checkSummaryId,
        checkOutcome: checkOutcome,
        checkOutcomeDetails: checkOutcomeDetails
      },
      request
    );

    if (response?.error) {
      throw new Error(response.error);
    }

    return response?.data || null;
  } catch (error) {
    global.appInsightsClient.trackException({ exception: error });
    console.error("Error in getCompleteCheckDetails:", error);
    throw error;
  }
};



export default {
  getSpsReferrals,
  getCompleteCheckDetails,
  updateCheckOutcomeSps
};
