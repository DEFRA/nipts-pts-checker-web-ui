"use strict";

const VIEW_PATH = "componentViews/checker/checkReport/reportDetails";

const getCheckDetails = async (request, h) => {

  //Populate here with API call to get details
  
  return h.view(VIEW_PATH, {
    currentSailingSlot: request.yar.get("currentSailingSlot") || {},
  });
};

export const ReferredHandlers = {
  getCheckDetails
};
