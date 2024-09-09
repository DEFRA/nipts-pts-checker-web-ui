import { CurrentSailingMainModel } from "../models/currentSailingMainModel.js";
import CurrentSailingModel from "../../constants/currentSailingConstant.js";
import dotenv from "dotenv";
import httpService from "./httpService.js";
import { HttpStatusConstants } from '../../../src/constants/httpMethod.js';

dotenv.config();

const baseUrl =
  process.env.BASE_API_URL || "https://devptswebaw1003.azurewebsites.net/api";

const getCurrentSailingMain = async (request) => {
  // Accept the request parameter here
  try {
    const response = await httpService.getAsync(
      `${baseUrl}/sailing-routes`,
      request
    );

    if(response.status !== HttpStatusConstants.OK || response.data === undefined)
    {
      return response;
    }

    CurrentSailingModel.currentSailingMainModelData.routes = response.data.map(
      (route) => ({
        id: String(route.id), // Convert id to a string
        value: route.routeName,
        label: route.routeName,
      })
    );    

    return new CurrentSailingMainModel(
      CurrentSailingModel.currentSailingMainModelData
    );

  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export default {
  getCurrentSailingMain,
};
