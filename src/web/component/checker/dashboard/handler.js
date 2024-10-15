"use strict";
import dashboardMainService from "../../../../api/services/dashboardMainService.js";
import DashboardMainModel from "../../../../constants/dashBoardConstant.js";
import headerData from "../../../../web/helper/constants.js";

const VIEW_PATH = "componentViews/checker/dashboard/dashboardView";

const getDashboard = async (request, h) => {
  const dashboardData = await dashboardMainService.getCheckOutcomes(
    process.env.DASHBOARD_START_HOUR || "-48",
    process.env.DASHBOARD_END_HOUR || "24",
    request
  );
  
   if (dashboardData && dashboardData.length > 0) {
    headerData.section = "dashboard"
    const currentSailingSlot = request.yar.get("CurrentSailingSlot") || {};
    currentSailingSlot.currentDate = new Date().toLocaleDateString("en-GB");
    currentSailingSlot.pageTitle = DashboardMainModel.dashboardMainModelData.pageTitle;
    const anyChecks = "false";
    return h.view(VIEW_PATH, { currentSailingSlot, anyChecks });
   }
   else{
    const currentSailingSlot = request.yar.get("CurrentSailingSlot") || {};
    currentSailingSlot.currentDate = new Date().toLocaleDateString("en-GB");
    currentSailingSlot.pageTitle =
      DashboardMainModel.dashboardMainModelData.pageTitle;
    const anyChecks = "true";
    return h.view(VIEW_PATH, { currentSailingSlot, anyChecks });
   }
};

export const DashboardHandlers = {
  getDashboard,
};
