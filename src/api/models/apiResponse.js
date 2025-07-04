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

class ForbiddenResponse {
  constructor(status, error) {
    this.status = status;
    this.error = error;
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
  ForbiddenResponse,
  NotFoundResponse,
  ServerErrorResponse,
};
