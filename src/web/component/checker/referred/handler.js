"use strict";

import spsReferralMainService from "../../../../api/services/spsReferralMainService.js";
import headerData from "../../../../web/helper/constants.js";
import moment from "moment";

const VIEW_PATH = "componentViews/checker/referred/referredView";

const getReferredChecks = async (request, h) => {
  headerData.section = "referred";

  // Retrieve data from the session
  const routeName = request.yar.get("routeName");
  const departureDate = request.yar.get("departureDate");
  const departureTime = request.yar.get("departureTime");

  // Handle missing data
  if (!routeName || !departureDate || !departureTime) {
    return h.redirect("/checker/dashboard");
  }

  const serviceName = `${headerData.checkerTitle}: ${headerData.checkerSubtitle}`;

  // Combine date and time
  const departureDateTimeString = `${departureDate} ${departureTime}`;
  const departureDateTime = moment(
    departureDateTimeString,
    "DD/MM/YYYY HH:mm"
  ).toISOString();

  // Call the API service
  const spsChecks =
    (await spsReferralMainService.GetSpsReferrals(
      routeName,
      departureDateTime,
      process.env.DASHBOARD_START_HOUR * -1 || "48",
      request
    )) || [];

  // Redirect if there are no spsChecks
  if (spsChecks.length === 0) {
    return h.redirect("/checker/referred");
  }
  
  // Assign class colors based on outcome
  spsChecks.forEach((item) => {
    switch (item.SPSOutcome) {
      case "Check Needed":
        item.classColour = "blue";
        break;
      case "Allowed":
        item.classColour = "green";
        break;
      case "Not Allowed":
        item.classColour = "red";
        break;
    }
  });

  // Implement pagination
  const page = parseInt(request.query.page) || 1; // Get page number from query parameter, default to 1
  const pageSize = 10; // Number of records per page

  const totalRecords = spsChecks.length;
  const totalPages = Math.ceil(totalRecords / pageSize);

  // Ensure page is within bounds
  const currentPage = Math.min(Math.max(page, 1), totalPages);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedSpsChecks = spsChecks.slice(startIndex, endIndex);

  // Generate an array of page numbers for the pagination component
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  // Prepare data for the view
  const check = {
    routeName,
    departureDate,
    departureTime,
  };

  return h.view(VIEW_PATH, {
    serviceName,
    currentSailingSlot: request.yar.get("currentSailingSlot") || {},
    check,
    spsChecks: paginatedSpsChecks,
    page: currentPage,
    totalPages,
    pages,
  });
};

const postCheckReport = async (request, h) => {
  const { CheckSummaryId } = request.payload;
  request.yar.set("checkSummaryId", CheckSummaryId);

  return h.redirect("/checker/referred");
};

export const ReferredHandlers = {
  getReferredChecks,
  postCheckReport,
};
