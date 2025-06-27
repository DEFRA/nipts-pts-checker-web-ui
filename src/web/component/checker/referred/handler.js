"use strict";

import spsReferralMainService from "../../../../api/services/spsReferralMainService.js";
import headerData from "../../../../web/helper/constants.js";
import moment from "moment";

const VIEW_PATH = "componentViews/checker/referred/referredView";
const dashboardTimeBoundary = 48;

const getReferredChecks = async (request, h) => {
  headerData.section = "referred";

  // Retrieve data from the session
  const { routeName, departureDate, departureTime } = getSessionData(request);

  // Handle missing data
  if (!routeName || !departureDate || !departureTime) {
    return h.redirect("/checker/dashboard");
  }

  const serviceName = `${headerData.checkerTitle}: ${headerData.checkerSubtitle}`;
  const departureDateTime = formatDateTime(departureDate, departureTime);

  // Call the API service
  const spsChecks = await getSpsChecks(routeName, departureDateTime, request);

  // Redirect if there are no spsChecks
  if (spsChecks.length === 0) {
    return h.redirect("/checker/referred");
  }

  // Assign class colors and format PTD numbers
  assignClassColors(spsChecks);
  formatPTDNumbers(spsChecks);

  const page = parseInt(request.query.page || request.query.nextPage || request.query.previousPage) || 1; // Get page number from query parameter, default to 1
  // Implement pagination
  const { paginatedSpsChecks, currentPage, totalPages, pages } = paginateSpsChecks(page, spsChecks);

  // Prepare data for the view
  const check = { routeName, departureDate, departureTime };

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


function getSessionData(request) {
  return {
    routeName: request.yar.get("routeName"),
    departureDate: request.yar.get("departureDate"),
    departureTime: request.yar.get("departureTime"),
  };
}

function formatDateTime(departureDate, departureTime) {
  const departureDateTimeString = `${departureDate} ${departureTime}`;
  return moment(departureDateTimeString, "DD/MM/YYYY HH:mm").toISOString();
}

async function getSpsChecks(routeName, departureDateTime, request) {
  return (
    (await spsReferralMainService.getSpsReferrals(
      routeName,
      departureDateTime,
      Number(process.env.DASHBOARD_START_HOUR) * -1 || dashboardTimeBoundary,
      request
    )) || []
  );
}

function assignClassColors(spsChecks) {
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
}

function formatPTDNumbers(spsChecks) {
  spsChecks.forEach((item) => {
    if (item.PTDNumber.startsWith("GB")) {
      item.PTDNumberFormatted = formatPTDNumber(item.PTDNumber);
    }
  });
}

function formatPTDNumber(PTDNumber) {
  const PTD_LENGTH = 11;
  const PTD_PREFIX_LENGTH = 5;
  const PTD_MID_LENGTH = 8;

  return `${PTDNumber.padStart(PTD_LENGTH, "0").slice(0, PTD_PREFIX_LENGTH)} ` +
      `${PTDNumber.padStart(PTD_LENGTH, "0").slice(PTD_PREFIX_LENGTH, PTD_MID_LENGTH)} ` +
      `${PTDNumber.padStart(PTD_LENGTH, "0").slice(PTD_MID_LENGTH)}`;
}

function paginateSpsChecks(page, spsChecks) {
  const pageSize = 10; // Number of records per page
  const totalRecords = spsChecks.length;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const currentPage = Math.min(Math.max(parseInt(page) || 1, 1), totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedSpsChecks = spsChecks.slice(startIndex, endIndex);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return { paginatedSpsChecks, currentPage, totalPages, pages };
}


const postCheckReport = async (request, h) => {
  const { CheckSummaryId, PTDNumber, ApplicationNumber } = request.payload;

  const identifier = PTDNumber || ApplicationNumber;
  if (identifier) {
    request.yar.set("identifier", identifier);
  }

  request.yar.set("checkSummaryId", CheckSummaryId);

  return h.redirect("/checker/checkreportdetails");
};




export const ReferredHandlers = {
  getReferredChecks,
  postCheckReport,
};
