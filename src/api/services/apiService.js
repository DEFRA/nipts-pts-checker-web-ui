import httpService from "./httpService.js";

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

const getApplicationByPTDNumber = async (ptdNumber) => {
  const request = { ptdNumber: ptdNumber };
  const url = buildApiUrl("Checker/CheckPTDNumber");
  return await httpService.postAsync(url, request);
};

const getApplicationByApplicationNumber = async (applicationNumber) => {
  const request = { applicationNumber: applicationNumber };
  const url = buildApiUrl("Checker/checkApplicationNumber");
  return await httpService.postAsync(url, request);
};

export default {
  getApplicationByPTDNumber,
  getApplicationByApplicationNumber,
};
