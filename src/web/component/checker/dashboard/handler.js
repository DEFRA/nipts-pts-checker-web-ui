"use strict";
import dashboardMainService from "../../../../api/services/dashboardMainService.js";
import DashboardMainModel from "../../../../constants/dashBoardConstant.js";
import headerData from "../../../../web/helper/constants.js";

const VIEW_PATH = "componentViews/checker/dashboard/dashboardView";

const getDashboard = async (request, h) => {
  headerData.section = "dashboard";

  const currentSailingSlot = request.yar.get("currentSailingSlot") || {};
  currentSailingSlot.currentDate = new Date().toLocaleDateString("en-GB");
  currentSailingSlot.pageTitle = DashboardMainModel.dashboardMainModelData.pageTitle;

  currentSailingSlot.isFlight = false;
  if (currentSailingSlot.selectedRouteOption.value === 'Flight') {
    currentSailingSlot.isFlight = true;
  }
  
  let successConfirmation = request.yar.get("successConfirmation");
  if (successConfirmation === null) {
    successConfirmation = false;
  }

  request.yar.clear("successConfirmation");

  let checks = [];
  const response = await dashboardMainService.getCheckOutcomes(
    process.env.DASHBOARD_START_HOUR || "-48",
    process.env.DASHBOARD_END_HOUR || "24",
    request
  );
  
  if (Array.isArray(response)) {     
    if (currentSailingSlot.selectedRoute && currentSailingSlot.selectedRouteOption.value === 'Ferry') {
      checks = response.filter(check => check.routeName === currentSailingSlot.selectedRoute.value); // filter checks by ferry
    } else {
      checks = response; // otherwise just give everything
    }

  } else {
    console.error("Unexpected checks response: ", response.error.error);
  }
  
  return h.view(VIEW_PATH, { currentSailingSlot, checks, successConfirmation });
};

const postReferred = async (request, h) => {
  const { routeId, routeName, departureDate, departureTime } = request.payload;
  request.yar.set("routeId", routeId);
  request.yar.set("routeName", routeName);
  request.yar.set("departureDate", departureDate);
  request.yar.set("departureTime", departureTime);
  
  return h.redirect("/checker/referred");
};

export const DashboardHandlers = {
  getDashboard,
  postReferred,
};
