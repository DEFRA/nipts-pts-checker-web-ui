"use strict";
import DashboardMainModel from "../../../../constants/dashBoardConstant.js";
import headerData from "../../../../web/helper/constants.js";

const VIEW_PATH = "componentViews/checker/dashboard/dashboardView";

const getDashboard = async (request, h) => {
  headerData.section = "dashboard"
  const currentSailingSlot = request.yar.get("CurrentSailingSlot") || {};
  currentSailingSlot.currentDate = new Date().toLocaleDateString("en-GB");
  currentSailingSlot.pageTitle =
    DashboardMainModel.dashboardMainModelData.pageTitle;

  const anyChecks = request.query.nochecks;

  return h.view(VIEW_PATH, { currentSailingSlot, anyChecks });
};

export const DashboardHandlers = {
  getDashboard,
};
