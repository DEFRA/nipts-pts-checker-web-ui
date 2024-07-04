"use strict";

import appSettingsService from "../../../../api/services/appSettingsService.js";
import requestAuthorizationCodeUrl from "../../../../auth/auth-code-grant/request-authorization-code-url.js";
import session from "../../../../session/index.js";

const VIEW_PATH = "componentViews/checker/home/view";

const getHome = async (request, h) => {

  const appSettings = await appSettingsService.getAppSettings();
  const loginUrl = requestAuthorizationCodeUrl(session, request);

  const model = { ...appSettings, loginUrl: loginUrl };

  return h.view(VIEW_PATH, { model });
};

export const HomeHandlers = {
  getHome,
};
