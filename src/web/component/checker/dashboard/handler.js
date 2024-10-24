"use strict";
import dashboardMainService from "../../../../api/services/dashboardMainService.js";
import DashboardMainModel from "../../../../constants/dashBoardConstant.js";
import headerData from "../../../../web/helper/constants.js";

const VIEW_PATH = "componentViews/checker/dashboard/dashboardView";

const getDashboard = async (request, h) => {
  headerData.section = "dashboard";

  const currentSailingSlot = request.yar.get("currentSailingSlot") || {};
  currentSailingSlot.currentDate = new Date().toLocaleDateString("en-GB");
  currentSailingSlot.pageTitle =
    DashboardMainModel.dashboardMainModelData.pageTitle;

  let successConfirmation = request.yar.get("successConfirmation");
  if(successConfirmation === null)
  {
    successConfirmation = false;
  }

  request.yar.clear("successConfirmation");

  // get checks
  const checks =
    (await dashboardMainService.getCheckOutcomes(
      process.env.DASHBOARD_START_HOUR || "-47",
      process.env.DASHBOARD_END_HOUR || "25",
      request
    )) || [];

  return h.view(VIEW_PATH, { currentSailingSlot, checks, successConfirmation});
};

export const DashboardHandlers = {
  getDashboard,
};
