"use strict";
import headerData from "../../../../web/helper/constants.js";

const VIEW_PATH = "componentViews/checker/referred/referredView";

const getReferredChecks = async (request, h) => {
  headerData.section = "referred";

  const serviceName = `${headerData.checkerTitle}: ${headerData.checkerSubtitle}`;
  return h.view(VIEW_PATH, {serviceName});
};

export const ReferredHandlers = {
  getReferredChecks,
};
