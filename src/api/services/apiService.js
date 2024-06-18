import httpService from "./httpService.js";

const buildApiUrl = (endpoint) => {
  const baseUrl =
    process.env.BASE_API_URL || "https://devptswebaw1003.azurewebsites.net/api";
  return `${baseUrl}/${endpoint}`;
};

const getApplicationByPTDNumber = async (ptdNumber) => {
  const request = { ptdNumber: ptdNumber };
  const url = buildApiUrl("Checker/CheckPTDNumber");
  return await httpService.postAsync(url, request);
};

export default {
  getApplicationByPTDNumber,
};
