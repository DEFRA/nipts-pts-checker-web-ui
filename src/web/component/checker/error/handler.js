"use strict";

const HTTP_STATUS = {
  SERVER_ERROR: 500,
};
const ERROR_VIEW = "errors/500Error";

const get500Error = async (_request, h) => {
    return h.view(ERROR_VIEW).code(HTTP_STATUS.SERVER_ERROR).takeover();
};

export const ErrorHandlers = {
  get500Error,
};
