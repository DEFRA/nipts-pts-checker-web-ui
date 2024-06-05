import { CurrentSailingMainModel } from "../models/currentSailingMainModel.js";
import  CurrentSailingModel  from "../../constants/currentSailingConstant.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const baseUrl = process.env.BASE_API_URL; // Default to dev url
const getCurrentSailingMain = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/sailing-routes`);

      CurrentSailingModel.currentSailingMainModelData.routes = response.data.map(route => ({
                                                                id: String(route.id), // Convert id to a string
                                                                value: route.routeName,
                                                                label: route.routeName
                                                              }));
      return new CurrentSailingMainModel(CurrentSailingModel.currentSailingMainModelData);
    
  } catch (error) {
      console.error('Error fetching data:', error);
  }
};

export default {
    getCurrentSailingMain,
};
