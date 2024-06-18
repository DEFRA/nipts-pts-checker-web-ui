import axios from "axios";
import {
  OkResponse,
  BadRequestResponse,
  NotFoundResponse,
  ServerErrorResponse,
} from "../models/apiResponse.js";
import { HttpStatusConstants } from "../../constants/httpMethod.js";

/*========== errorResponseWithErrorLogging(e): Logs error and returns ServerErrorResponse ==========*/
const errorResponseWithErrorLogging = (error) => {
  console.log("handleError: error.toJSON()", error.toJSON());

  let errorMessage = "Unknown error";

  if (error.response) {
    // The request was made and the server responded with a status code that falls out of the range of 2xx
    console.log(error.response);
    errorMessage = "An error has occurred";
  } else if (error.request) {
    // The request was made but no response was received, `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js
    errorMessage = "No response received";
    console.log(error.request);
  } else {
    errorMessage = error.message;
    console.log(`Error message: ${error.message}`);
  }

  return serverErrorResponse(errorMessage);
};

/*========== statusBasedResponse(r): Returns statusBasedResponse ==========*/
const statusBasedResponse = (response) => {
  let result = null;
  switch (response.status) {
    case HttpStatusConstants.BAD_REQUEST:
      result = badRequestResponse(response);
      break;
    case HttpStatusConstants.NOT_FOUND:
      result = notFoundResponse();
      break;
    case HttpStatusConstants.INTERNAL_SERVER_ERROR:
      result = serverErrorResponse(response);
      break;
    default:
      result = successResponse(response);
      break;
  }

  console.log("API Response", result);
  return result;
};

/*========== successResponse(r): Returns OkResponse ==========*/
const successResponse = (response) => {
  return new OkResponse(response.status, response.data);
};

/*========== badRequestResponse(r): Returns BadRequestResponse ==========*/
const badRequestResponse = (response) => {
  return new BadRequestResponse(response.data.title, response.data.errors);
};

/*========== notFoundResponse(): Returns NotFoundResponse ==========*/
const notFoundResponse = () => {
  return new NotFoundResponse("Resource not found");
};

const serverErrorResponse = (errorMessage) => {
  return new ServerErrorResponse(errorMessage ? errorMessage : "An error has occurred");
};

/*========== validateStatus(s): Resolve only if the status code is less than 500 ==========*/
const validateStatus = (status) => {
  return status < HttpStatusConstants.INTERNAL_SERVER_ERROR;
};

const options = {
  headers: {
    "Content-Type": "application/json",
  },
  auth: {
    username: "tbc",
    password: "tbc",
  },
  validateStatus: function (status) {
    return validateStatus(status);
  }
};

/*========== getSync(url): GET API Call (Sync) ==========*/
const getSync = (url) => {
  console.log("getSync (url)", url);
  axios
    .get(url, options)
    .then(function (response) {
      return statusBasedResponse(response);
    })
    .catch(function (error) {
      return errorResponseWithErrorLogging(error);
    });
};

/*========== postSync(url, data): POST API Call (Sync) ==========*/
const postSync = (url, data) => {
  console.log("postSync (url, data)", url, data);
  axios
    .post(url, data, options)
    .then(function (response) {
      return statusBasedResponse(response);
    })
    .catch(function (error) {
      return errorResponseWithErrorLogging(error);
    });
};

/*========== getAsync(url): GET API Call (Async) ==========*/
const getAsync = async (url) => {
  try {
    console.log("getAsync (url)", url);
    const response = await axios.get(url, options);
    return statusBasedResponse(response);
  } catch (error) {
    return errorResponseWithErrorLogging(error);
  }
};

/*========== postAsync(url, data): POST API Call (Async) ==========*/
const postAsync = async (url, data) => {
  try {
    console.log("postAsync (url, data)", url, data);
    const response = await axios.post(url, data, options);
    return statusBasedResponse(response);
  } catch (error) {
    return errorResponseWithErrorLogging(error);
  }
};

/*========== putAsync(url, data): PUT API Call (Async) ==========*/
const putAsync = async (url, data) => {
  try {
    console.log("putAsync (url, data)", url, data);
    const response = await axios.put(url, data, options);
    return statusBasedResponse(response);
  } catch (error) {
    return errorResponseWithErrorLogging(error);
  }
};

/*========== deleteAsync(url): DELETE API Call (Async) ==========*/
const deleteAsync = async (url) => {
  try {
    console.log("deleteAsync (url)", url);
    const response = await axios.delete(url, options);
    return statusBasedResponse(response);
  } catch (error) {
    return errorResponseWithErrorLogging(error);
  }
};

export default {
  getAsync,
  postAsync,
  putAsync,
  deleteAsync,
  getSync,
  postSync,
};
