import axios from "axios";
import {
  OkResponse,
  BadRequestResponse,
  NotFoundResponse,
  ServerErrorResponse,
} from "../models/apiResponse.js";
import { HttpStatusConstants } from "../../constants/httpMethod.js";
import session from "../../session/index.js";
import sessionKeys from "../../session/keys.js";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

/*========== errorResponseWithErrorLogging(e): Logs error and returns ServerErrorResponse ==========*/
const errorResponseWithErrorLogging = (error) => {
  console.log("handleError: error.toJSON()", error.toJSON());

  let errorMessage;

  if (error.response) {
    console.log(error.response);
    errorMessage = "An error has occurred";
  } else if (error.request) {
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
      result = notFoundResponse(response.data);
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
  return new BadRequestResponse(
    response.status,
    response.data.title,
    response.data.errors
  );
};

/*========== notFoundResponse(): Returns NotFoundResponse ==========*/
const notFoundResponse = (errorMessage) => {
  if (!errorMessage) {
    errorMessage = "Resource not found";
  }

  return new NotFoundResponse(HttpStatusConstants.NOT_FOUND, errorMessage);
};

const serverErrorResponse = (errorMessage) => {
  if (!errorMessage) {
    errorMessage = "An error has occurred";
  }

  return new ServerErrorResponse(
    HttpStatusConstants.INTERNAL_SERVER_ERROR,
    errorMessage
  );
};

/*========== validateStatus(s): Resolve only if the status code is less than 500 ==========*/
const validateStatus = (status) => {
  return status < HttpStatusConstants.INTERNAL_SERVER_ERROR;
};

const createOptions = (request) => {
  const subscriptionKey = process.env.OCP_APIM_SUBSCRIPTION_KEY;
  const token = session.getToken(request, sessionKeys.tokens.accessToken);

  return {
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": subscriptionKey,
      Authorization: `Bearer ${token}`,
    },
    validateStatus,
    mode: "no-cors", // Add no-cors mode
  };
};

/*========== getSync(url): GET API Call (Sync) ==========*/
const getSync = (url, request) => {
  console.log("getSync (url)", url);
  axios
    .get(url, createOptions(request))
    .then(function (response) {
      return statusBasedResponse(response);
    })
    .catch(function (error) {
      return errorResponseWithErrorLogging(error);
    });
};

/*========== postSync(url, data): POST API Call (Sync) ==========*/
const postSync = (url, data, request) => {
  console.log("postSync (url, data)", url, data);
  axios
    .post(url, data, createOptions(request))
    .then(function (response) {
      return statusBasedResponse(response);
    })
    .catch(function (error) {
      return errorResponseWithErrorLogging(error);
    });
};

/*========== getAsync(url): GET API Call (Async) ==========*/
const getAsync = async (url, request) => {
  try {
    console.log("getAsync (url)", url);
    const response = await axios.get(url, createOptions(request));
    return statusBasedResponse(response);
  } catch (error) {
    return errorResponseWithErrorLogging(error);
  }
};

/*========== postAsync(url, data, request): POST API Call (Async) ==========*/
const postAsync = async (url, data, request) => {
  try {
    console.log("postAsync (url, data)", url, data);
    const response = await axios.post(url, data, createOptions(request));
    return statusBasedResponse(response);
  } catch (error) {
    return errorResponseWithErrorLogging(error);
  }
};

/*========== putAsync(url, data, request): PUT API Call (Async) ==========*/
const putAsync = async (url, data, request) => {
  try {
    console.log("putAsync (url, data)", url, data);
    const response = await axios.put(url, data, createOptions(request));
    return statusBasedResponse(response);
  } catch (error) {
    return errorResponseWithErrorLogging(error);
  }
};

/*========== deleteAsync(url, request): DELETE API Call (Async) ==========*/
const deleteAsync = async (url, request) => {
  try {
    console.log("deleteAsync (url)", url);
    const response = await axios.delete(url, createOptions(request));
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
