"use strict";

import spsReferralMainService from "../../../../api/services/spsReferralMainService.js";
import apiService from "../../../../api/services/apiService.js";

const VIEW_PATH = "componentViews/checker/checkReport/reportDetails";

async function getCheckDetails(request, h) {
  try {
    const identifier = request.yar.get("identifier");

    if (!identifier) {
      console.error("Identifier is not available in yar.");
      return h.response({ error: "Identifier is required" }).code(400);
    }

    const checkDetails = await spsReferralMainService.GetCompleteCheckDetails(
      identifier,
      request
    );

    if (!checkDetails) {
      return h.response("No data found for the provided identifier").code(404);
    }

    const formatDate = (date) =>
      date
        ? new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }).format(new Date(date))
        : "Not available";

    const formatTime = (time) =>
      time
        ? new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23",
          }).format(new Date(`1970-01-01T${time}Z`))
        : "Not available";

    const formattedCheckDetails = {
      reference:
        checkDetails.ptdNumber ||
        checkDetails.applicationReference ||
        "No reference",
      checkOutcome: checkDetails.checkOutcome || [],
      reasonForReferral: checkDetails.reasonForReferral || [],
      microchipNumber: checkDetails.microchipNumber || null,
      additionalComments: checkDetails.additionalComments || ["None"],
      gbCheckerName: checkDetails.gbCheckerName || "Unknown",
      dateTimeChecked: checkDetails.dateTimeChecked
        ? `${formatDate(checkDetails.dateTimeChecked)} ${formatTime(
            checkDetails.dateTimeChecked
          )}`
        : "Not available",
      route: checkDetails.route || "Not specified",
      scheduledDepartureDate: formatDate(checkDetails.scheduledDepartureDate),
      scheduledDepartureTime: formatTime(checkDetails.scheduledDepartureTime),
    };

    return h.view(VIEW_PATH, {
      checkDetails: formattedCheckDetails,
    });
  } catch (error) {
    console.error("Error in getCheckDetails:", error);
    return h
      .response({ error: "Internal Server Error", details: error.message })
      .code(500);
  }
}

async function conductSpsCheck(request, h) {
  try {
    const identifier = request.yar.get("identifier");

    if (!identifier) {
      return h.response({ error: "Identifier is required" }).code(400);
    }

    let responseData;
    if (identifier.startsWith("GB8268")) {
      responseData = await apiService.getApplicationByPTDNumber(
        identifier,
        request
      );
      if (!responseData) {
        return h
          .response("No data found for the provided PTD number")
          .code(404);
      }
      request.yar.set("ptdNumber", identifier);
    } else {
      responseData = await apiService.getApplicationByApplicationNumber(
        identifier,
        request
      );
      if (!responseData) {
        return h
          .response("No data found for the provided application number")
          .code(404);
      }
      request.yar.set("applicationNumber", identifier);
    }

    request.yar.set("data", responseData);

    return h.redirect("/checker/search-results");
  } catch (error) {
    return h
      .response({ error: "Internal Server Error", details: error.message })
      .code(500);
  }
}

export const CheckReportHandlers = {
  getCheckDetails,
  conductSpsCheck,
};
