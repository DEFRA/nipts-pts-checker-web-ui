"use strict";

const VIEW_PATH = "componentViews/checker/updateReferral/updateReferralView";

const getUpdateReferralForm = async (request, h) => {

  return h.view(VIEW_PATH);
};

const postUpdateReferralForm = async (request, h) => {
  /*const { CheckSummaryId, PTDNumber, ApplicationNumber } = request.payload;

  const identifier = PTDNumber || ApplicationNumber;
  if (identifier) {
    request.yar.set("identifier", identifier);
  }

  request.yar.set("checkSummaryId", CheckSummaryId);
*/
  return h.redirect("/checker/dashboard");
};




export const UpdateReferralHandler = {
  getUpdateReferralForm,
  postUpdateReferralForm,
};
