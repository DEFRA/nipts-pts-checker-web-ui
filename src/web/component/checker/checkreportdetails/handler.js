"use strict";

import featureFlagService from "../../../../api/services/featureFlagService.js";

const VIEW_PATH = "componentViews/checker/checkReport/reportDetails";

const getCheckDetails = async (request, h) => {
  const isCheckOutcomeDetailsEnabled = await featureFlagService.isFeatureEnabled("PtsWebCheckerUi_ReportCheckOutcomeDetailsPresent");

  const currentSailingSlot = request.yar.get("currentSailingSlot") || {};


  return h.view(VIEW_PATH, {
    currentSailingSlot: currentSailingSlot,
    isCheckOutcomeDetailsEnabled: isCheckOutcomeDetailsEnabled,
  });
};

export const ReferredHandlers = {
  getCheckDetails
};
