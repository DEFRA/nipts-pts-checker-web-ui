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
      process.env.DASHBOARD_START_HOUR || "-48",
      process.env.DASHBOARD_END_HOUR || "24",
      request
    )) || [];

  return h.view(VIEW_PATH, { currentSailingSlot, checks, successConfirmation});
};

const postReferred = async (request, h) => {
  const { routeName, departureDate, departureTime } = request.payload;
  request.yar.set("routeName", routeName);
  request.yar.set("departureDate", departureDate);
  request.yar.set("departureTime", departureTime);
  
  return h.redirect("/checker/referred");
};

export const DashboardHandlers = {
  getDashboard,
  postReferred,
};
