"use strict";
import DashboardMainModel from "../../../../constants/dashBoardConstant.js";

const VIEW_PATH = "componentViews/checker/dashboard/dashboardView";

const getDashboard = async (request, h) => {

  const currentSailingSlot = request.yar.get("CurrentSailingSlot") ?? {};
  currentSailingSlot.currentDate = new Date().toLocaleDateString("en-GB");
  currentSailingSlot.pageTitle =
    DashboardMainModel.dashboardMainModelData.pageTitle;
  
    return h.view(VIEW_PATH, { currentSailingSlot });
};

export const DashboardHandlers = {
  getDashboard,
};
