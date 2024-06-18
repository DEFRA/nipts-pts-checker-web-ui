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

const getApplicationByReferenceNumber = async (applicationNumber) => {
  const request = { applicationNumber: applicationNumber };
  const url = buildApiUrl("Checker/checkApplicationNumber");
  return await httpService.postAsync(url, request);
};

const getApplicationsByMicrochipNumber = async (microchipNumber) => {
  const request = { microchipNumber: microchipNumber };
  const url = buildApiUrl("Checker/checkMicrochipNumber");
  return await httpService.postAsync(url, request);
};

export default {
  getApplicationByPTDNumber,
  getApplicationByReferenceNumber,
  getApplicationsByMicrochipNumber,
};
