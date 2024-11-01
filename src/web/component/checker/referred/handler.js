"use strict";

import dashboardMainService from "../../../../api/services/dashboardMainService.js";
import spsReferralService from "../../../../api/services/spsReferralService.js";
import headerData from "../../../../web/helper/constants.js";
import moment from "moment";

const VIEW_PATH = "componentViews/checker/referred/referredView";

const getReferredChecks = async (_request, h) => {
  headerData.section = "referred";

  const currentSailingSlot = _request.yar.get("currentSailingSlot") || {};
  currentSailingSlot.currentDate = new Date().toLocaleDateString("en-GB");

  const serviceName = `${headerData.checkerTitle}: ${headerData.checkerSubtitle}`;
  // get checks
  const check =
    (await dashboardMainService.getCheckOutcomes(
      process.env.DASHBOARD_START_HOUR || "-47",
      process.env.DASHBOARD_END_HOUR || "25",
      _request
    )) || [];
  
    let splitDate = Date();
    if (check.length !== 0){
      const currentDateSplit = check[0].departureDate.split('/');
      const currentTimeSplit = check[0].departureTime.split(':');
      const monthIndex = Number(currentDateSplit[1]) - 1;
      splitDate = new Date(currentDateSplit[2], monthIndex, Number(currentDateSplit[0]), currentTimeSplit[0], currentTimeSplit[1]);
    }

  const spsChecks = 
  (await spsReferralService.GetSpsReferrals(check[0].routeName, moment(splitDate).toISOString(), _request))|| [];

  spsChecks.forEach((item) => {
    switch(item.SPSOutcome) {
      case 'Check Needed':
        item.classColour = "blue";
        break;
      case 'Allowed':
        item.classColour = "green";
        break;
      case 'Not Allowed':
        item.classColour = "red";
        break;
    }
  });

  return h.view(VIEW_PATH, {serviceName, currentSailingSlot, check, spsChecks});
};

export const ReferredHandlers = {
  getReferredChecks,
};
