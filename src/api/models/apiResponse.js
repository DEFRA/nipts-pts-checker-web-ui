import { HttpStatusConstants } from "../../constants/httpMethod.js";

class OkResponse {
  constructor(status, data) {
    this.status = status;
    this.data = data;
  }
}

class BadRequestResponse {
  constructor(status, error, validationErrors) {
    this.status = status;
    this.error = error;
    this.validationErrors = validationErrors;
  }
}

class NotFoundResponse {
  constructor(status, error) {
    this.status = status;
    this.error = error;
  }
}

class ServerErrorResponse {
  constructor(status, error) {
    this.status = status;
    this.error = error;
  }
}

export {
  OkResponse,
  BadRequestResponse,
  NotFoundResponse,
  ServerErrorResponse,
};
