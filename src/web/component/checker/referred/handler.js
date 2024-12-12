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
    switch (item.SPSOutcome.toLowerCase()) {
      case "check needed":
        item.classColour = "blue";
        break;
      case "allowed":
        item.classColour = "green";
        break;
      case "not allowed":
        item.classColour = "red";
        break;
      default:
        break;
    }
  });

  spsChecks.formatPTDNumber = formatPTDNumber(spsChecks.PTDNumber);

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

  // Format PTD number
  function formatPTDNumber(PTDNumber) {
    const PTD_LENGTH = 11;
    const PTD_PREFIX_LENGTH = 5;
    const PTD_MID_LENGTH = 8;
 
    let PTDNumberFormatted = PTDNumber
      ? `${PTDNumber.padStart(PTD_LENGTH, '0').slice(0, PTD_PREFIX_LENGTH)} ` +
        `${PTDNumber.padStart(PTD_LENGTH, '0').slice(PTD_PREFIX_LENGTH, PTD_MID_LENGTH)} ` +
        `${PTDNumber.padStart(PTD_LENGTH, '0').slice(PTD_MID_LENGTH)}`
      : "";

      return PTDNumberFormatted;
  }
};

const postCheckReport = async (request, h) => {
  const { CheckSummaryId, PTDNumber, ApplicationNumber } = request.payload;

  if (PTDNumber) {
    request.yar.set("identifier", PTDNumber); // Set PTDNumber as identifier
  } else if (ApplicationNumber) {
    request.yar.set("identifier", ApplicationNumber); // Set ApplicationNumber as identifier
  } else if (CheckSummaryId) {
    request.yar.set("identifier", CheckSummaryId); // Set CheckSummaryId as identifier
  } else {
    return h
      .response("Invalid request payload. Missing identifiers.")
      .code(400);
  }

  return h.redirect("/checker/checkreportdetails");
};



export const ReferredHandlers = {
  getReferredChecks,
  postCheckReport,
};
