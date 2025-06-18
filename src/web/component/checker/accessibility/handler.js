
"use strict";


import headerData from "../../../../web/helper/constants.js";

const VIEW_PATH = "componentViews/checker/accessibility/view";

const getAccessibilityStatement = async (request, h) => {
  headerData.section = "accessibility";

  const model = {
    checkerTitle: "Pet Travel Scheme",
    checkerSubtitle: "Check a pet travelling from GB to NI",
  };

  return h.view(VIEW_PATH, { model });
};

export const AccessibilityHandlers = {
  getAccessibilityStatement,
};

