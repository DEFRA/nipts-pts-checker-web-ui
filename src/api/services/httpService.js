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
import getSecretValue from "./keyvaultService.js";
import KeyVaultConstants from "../../constants/KeyVaultConstant.js";
import { v1 } from "uuid";

// Load environment variables from .env file
dotenv.config();

if (process.env.NODE_ENV === "local" && !process.env.DEFRA_ID_CLIENT_ID) {
  dotenv.config({ path: "./.env.local", override: true });
}

const getSubscriptionKey = async (envValue, secretKey) => {
  if (!envValue || envValue === "") {
    const kvValue = await getSecretValue(secretKey);
    return kvValue;
  }

  return envValue;
};

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

const createOptions = async (request) => {
  const subscriptionKey = await getSubscriptionKey(
    process.env.OCP_APIM_SUBSCRIPTION_KEY,
    KeyVaultConstants.OCP_APIM_SUBSCRIPTION_KEY
  );
  const token = session.getToken(request, sessionKeys.tokens.accessToken);

  return {
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": subscriptionKey,
      Authorization: `Bearer ${token}`,
    },
    validateStatus,
  };
};

/*========== getAsync(url): GET API Call (Async) ==========*/
const getAsync = async (url, request) => {
  try {
    console.log("getAsync (url)", url);
    const options = await createOptions(request);
    const response = await axios.get(url, options);
    return statusBasedResponse(response);
  } catch (error) {
    return errorResponseWithErrorLogging(error);
  }
};

/*========== postAsync(url, data, request): POST API Call (Async) ==========*/
const postAsync = async (url, data, request) => {
  try {
    console.log("postAsync (url, data)", url, data);
    const options = await createOptions(request);
    const response = await axios.post(url, data, options);
    return statusBasedResponse(response);
  } catch (error) {
    return errorResponseWithErrorLogging(error);
  }
};

/*========== putAsync(url, data, request): PUT API Call (Async) ==========*/
const putAsync = async (url, data, request) => {
  try {
    console.log("putAsync (url, data)", url, data);
    const options = await createOptions(request);
    const response = await axios.put(url, data, options);
    return statusBasedResponse(response);
  } catch (error) {
    return errorResponseWithErrorLogging(error);
  }
};

/*========== deleteAsync(url, request): DELETE API Call (Async) ==========*/
const deleteAsync = async (url, request) => {
  try {
    console.log("deleteAsync (url)", url);
    const options = await createOptions(request);
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
};
