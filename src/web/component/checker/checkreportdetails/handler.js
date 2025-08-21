import moment from "moment";
import spsReferralMainService from "../../../../api/services/spsReferralMainService.js";
import apiService from "../../../../api/services/apiService.js";
import { HttpStatusConstants } from "../../../../constants/httpMethod.js";

const VIEW_PATH = "componentViews/checker/checkReport/reportDetails";
const dateNotavailableText = "Not available";

async function getCheckDetails(request, h) {
  try {
    const ref = request.yar.get("identifier");
    const checkSummaryId = request.yar.get("checkSummaryId");

    const checkDetails = await spsReferralMainService.getCompleteCheckDetails(
      checkSummaryId,
      request
    );

    if (!checkDetails) {
      return h
        .response("No data found for the provided CheckSummaryId")
        .code(HttpStatusConstants.NOT_FOUND);
    }

    const formatDateTime = (dateTime) => {
      return dateTime
        ? moment(dateTime, ["YYYY-MM-DD HH:mm:ss", "YYYY-MM-DD"]).format(
            "DD/MM/YYYY HH:mm"
          )
        : dateNotavailableText;
    };

    const formatScheduledDate = (date) => {
      return date ? moment(date).format("DD/MM/YYYY") : dateNotavailableText;
    };

    const shouldDisplayMicrochip = checkDetails.reasonForReferral?.some(
      (reason) => reason === "Microchip number does not match the PTD"
    );

    const hasValidComments = (comments) => {
      if (!comments || !Array.isArray(comments)) {
        return false;
      }

      return comments.some(
        (comment) =>
          comment && typeof comment === "string" && comment.trim() !== ""
      );
    };

    const formattedCheckDetails = {
      reference: ref,
      checkOutcome: checkDetails.checkOutcome || [],
      reasonForReferral: checkDetails.reasonForReferral || [],
      microchipNumber: shouldDisplayMicrochip
        ? checkDetails.microchipNumber
        : null,
      additionalComments: hasValidComments(checkDetails.additionalComments)
        ? checkDetails.additionalComments
        : ["None"],
      detailsComments: hasValidComments(checkDetails.detailsComments)
        ? checkDetails.detailsComments
        : ["None"],
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
        : dateNotavailableText,
      checkSummaryId: checkSummaryId
    };

    const isGBCheck = request.yar.get("isGBCheck");

    return h.view(VIEW_PATH, {
      checkDetails: formattedCheckDetails,
      isGBCheck
    });
  } catch (error) {
    global.appInsightsClient.trackException({ exception: error });
    console.error("Error in getCheckDetails:", error);
    throw error;
  }
}

async function conductSpsCheck(request, h) {
  try {
    const identifier = request.yar.get("identifier");

    if (!identifier) {
      return h
        .response({ error: "Identifier is required" })
        .code(HttpStatusConstants.BAD_REQUEST);
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
          .code(HttpStatusConstants.NOT_FOUND);
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
          .code(HttpStatusConstants.NOT_FOUND);
      }
      request.yar.set("applicationNumber", identifier);
    }

    request.yar.set("data", responseData);

    return h.redirect("/checker/search-results");
  } catch (error) {
    global.appInsightsClient.trackException({ exception: error });
    console.error("Error in conductSpsCheck:", error);
    throw error;
  }
}

export const CheckReportHandlers = {
  getCheckDetails,
  conductSpsCheck,
};
