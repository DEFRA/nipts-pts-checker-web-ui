import { DashboardMainModel } from "../models/dashboardMainModel.js";
import dotenv from "dotenv";
import httpService from "./httpService.js";
import moment from "moment";

dotenv.config();

const baseUrl =
  process.env.BASE_API_URL || "https://devptswebaw1003.azurewebsites.net/api";

if (!baseUrl) {
  throw new Error("BASE_API_URL is not set in environment variables.");
}

// Format date helper function
const formatDate = (dateRaw) => {
  const date = dateRaw ? new Date(dateRaw) : null;
  return date ? moment(date).format("DD/MM/YYYY") : undefined;
};

const getCheckOutcomes = async (startHour, endHour, request) => {
  try {
    const response = await httpService.postAsync(
      `${baseUrl}/Checker/getCheckOutcomes`,
      { startHour, endHour },
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

    // Map each item to DashboardMainModel
    const dashboardItems = items.map((item) => {
      return new DashboardMainModel({
        routeId: item.routeId,
        routeName: item.routeName,
        operatorName: item.operatorName,
        departurePort: item.departurePort,
        arrivalPort: item.arrivalPort,
        departureDate: item.departureDate,
        departureTime: item.departureTime,
        passCount: item.passCount,
        failCount: item.failCount,
        failReason: item.failReason,
        viewDetailsLink: item.viewDetailsLink,
      });
    });

    return dashboardItems;
  } catch (error) {
    console.error("Error in getCheckOutcomes:", error);
    throw error;
  }
};

// Export the function
export default {
  getCheckOutcomes,
};
