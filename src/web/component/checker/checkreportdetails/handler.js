import moment from "moment";
import spsReferralMainService from "../../../../api/services/spsReferralMainService.js";
import apiService from "../../../../api/services/apiService.js";

const VIEW_PATH = "componentViews/checker/checkReport/reportDetails";

async function getCheckDetails(request, h) {
  try {
    let checkSummaryId = request.yar.get("checkSummaryId");

    const checkDetails = await spsReferralMainService.GetCompleteCheckDetails(
      checkSummaryId,
      request
    );

    if (!checkDetails) {
      return h
        .response("No data found for the provided CheckSummaryId")
        .code(404);
    }

    const formatDateTime = (dateTime) => {
      return dateTime
        ? moment(dateTime, ["YYYY-MM-DD HH:mm:ss", "YYYY-MM-DD"]).format(
            "DD/MM/YYYY HH:mm"
          )
        : "Not available";
    };

    const formatScheduledDate = (date) => {
      return date ? moment(date).format("DD/MM/YYYY") : "Not available";
    };

    const shouldDisplayMicrochip = checkDetails.reasonForReferral?.some(
      (reason) => reason === "Microchip number does not match the PTD"
    );

    const formattedCheckDetails = {
      reference:
        checkDetails.ptdNumber ||
        checkDetails.applicationReference ||
        "No reference",
      checkOutcome: checkDetails.checkOutcome || [],
      reasonForReferral: checkDetails.reasonForReferral || [],
      microchipNumber: shouldDisplayMicrochip
        ? checkDetails.microchipNumber
        : null,
      additionalComments: checkDetails.additionalComments || ["None"],
      gbCheckerName: checkDetails.gbCheckerName || "Unknown",
      dateTimeChecked: formatDateTime(checkDetails.dateAndTimeChecked),
      route: checkDetails.route || "Not specified",
      scheduledDepartureDate: formatScheduledDate(
        checkDetails.scheduledDepartureDate
      ),
      scheduledDepartureTime: checkDetails.scheduledDepartureTime
        ? moment(checkDetails.scheduledDepartureTime, "HH:mm:ss").format(
            "HH:mm"
          )
        : "Not available",
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
    if (identifier.startsWith("GB826")) {
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
    console.error("Error in conductSpsCheck:", error);
    return h
      .response({ error: "Internal Server Error", details: error.message })
      .code(500);
  }
}

export const CheckReportHandlers = {
  getCheckDetails,
  conductSpsCheck,
};
