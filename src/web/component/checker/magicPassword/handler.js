"use strict";
import session from "../../../../session/index.js";
import sessionKeys from "../../../../session/keys.js";
import headerData from "../../../../web/helper/constants.js";
import { validatePassword } from "./validate.js";
import appHelper from "../../../../helper/app-helper.js";

const VIEW_PATH = "componentViews/checker/magicPassword/view";

const getMagicPassword = async (request, h) => {
  headerData.section = "MagicPassword";

  var returnURL = appHelper.getQueryParamFromRequest(request, "returnURL") || "";

  return h.view(VIEW_PATH, { formSubmitted: false, returnURL });
};

const submitMagicPassword = async (request, h) => {
  headerData.section = "MagicPassword";

  const password = request.payload.password;
  const validationResult = validatePassword(password);

  if (!validationResult.isValid) {
    return h.view(VIEW_PATH, {
      error: validationResult.error,
      errorSummary: [{ fieldId: "Password", message: validationResult.error }],
      formSubmitted: true,
      returnURL: request.payload.returnURL,
    });
  }

  session.setToken(request, sessionKeys.tokens.magicPassword, "confirmed");

  if (request.payload.returnURL && request.payload.returnURL.length > 0) {
    return h.redirect(request.payload.returnURL);
  }

  return h.redirect("/");
};

export const MagicPasswordHandlers = {
  getMagicPassword,
  submitMagicPassword,
};
