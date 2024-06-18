import { HttpStatusConstants } from "../../constants/httpMethod.js";

class OkResponse {
  constructor(status, data) {
    this.status = status ?? HttpStatusConstants.OK;
    this.data = data;
  }
}

class BadRequestResponse {
  constructor(error, validationErrors) {
    this.status = HttpStatusConstants.BAD_REQUEST;
    this.error = error;
    this.validationErrors = validationErrors;
  }
}

class NotFoundResponse {
  constructor(error) {
    this.status = HttpStatusConstants.NOT_FOUND;
    this.error = error;
  }
}

class ServerErrorResponse {
  constructor(error) {
    this.status = HttpStatusConstants.INTERNAL_SERVER_ERROR;
    this.error = error;
  }
}

export {
  OkResponse,
  BadRequestResponse,
  NotFoundResponse,
  ServerErrorResponse,
};
