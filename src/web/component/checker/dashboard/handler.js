"use strict";
import DashboardMainModel from "../../../../constants/dashBoardConstant.js";
import headerData from "../../../../web/helper/constants.js";
import apiService from "../../../../api/services/apiService.js";

const VIEW_PATH = "componentViews/checker/dashboard/dashboardView";

const getDashboard = async (request, h) => {
  headerData.section = "dashboard";
  const currentSailingSlot = request.yar.get("CurrentSailingSlot") || {};
  currentSailingSlot.currentDate = new Date().toLocaleDateString("en-GB");
  currentSailingSlot.pageTitle =
    DashboardMainModel.dashboardMainModelData.pageTitle;

    currentSailingSlot.selectedRoute.value += (new Date()).toISOString();
  // Display checks for 48 hours in the past and 24 hours in the future.
  var payload = { startHour: "-720", endHour: "24" };
  const checks = await apiService.getCheckOutcomes(payload, request);
console.log('checks', checks);
  return h.view(VIEW_PATH, { currentSailingSlot, checks });
};

export const DashboardHandlers = {
  getDashboard,
};
