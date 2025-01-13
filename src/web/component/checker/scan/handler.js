"use strict";
import headerData from "../../../../web/helper/constants.js";

import apiService from "../../../../api/services/apiService.js";
import DashboardMainModel from "../../../../constants/dashBoardConstant.js";

const VIEW_PATH = "componentViews/checker/scan/scanView";
const SEARCH_RESULT_VIEW_PATH = "/checker/search-results";
const NOT_FOUND_VIEW_PATH =
  "componentViews/checker/documentsearch/documentNotFoundView";

const getScan = async (request, h) => {
  headerData.section = "scan"
  return h.view(VIEW_PATH);
};

const postScan = async (request, h) => {
  const { qrCodeData } = request.payload;

  try {
    const isPTD = /^GB826[A-Za-z0-9]{5,8}$/.test(qrCodeData);
    const isApplicationRef = /^[A-Za-z0-9]{8,11}$/.test(qrCodeData);

    if (isPTD) {
      const ptdNumber = qrCodeData;
      const responseData = await apiService.getApplicationByPTDNumber(
        ptdNumber,
        request
      );

      if (responseData.error) {
        if (responseData.error === "not_found") {
          return h.view(NOT_FOUND_VIEW_PATH, {
            searchValue: ptdNumber,
            pageTitle: DashboardMainModel.dashboardMainModelData.pageTitle,
          });
        } else {
          return h.view(NOT_FOUND_VIEW_PATH, {
            searchValue: qrCodeData,
            pageTitle: "Scan QR Code",
          });
        }
      }

      request.yar.set("ptdNumber", ptdNumber);
      request.yar.set("data", responseData);

      return h.redirect(SEARCH_RESULT_VIEW_PATH);
    } else if (isApplicationRef) {
      const applicationNumber = qrCodeData;
      const responseData = await apiService.getApplicationByApplicationNumber(
        applicationNumber,
        request
      );

      if (responseData.error) {
        if (responseData.error === "not_found") {
          return h.view(NOT_FOUND_VIEW_PATH, {
            searchValue: applicationNumber,
            pageTitle: DashboardMainModel.dashboardMainModelData.pageTitle,
          });
        } else {
          return h.view(NOT_FOUND_VIEW_PATH, {
            searchValue: qrCodeData,
            pageTitle: "Scan QR Code",
          });
        }
      }

      request.yar.set("applicationNumber", applicationNumber);
      request.yar.set("data", responseData);

      return h.redirect(SEARCH_RESULT_VIEW_PATH);
    } else {
      return h.view(NOT_FOUND_VIEW_PATH, {
        searchValue: qrCodeData,
        pageTitle: "Scan QR Code",
      });
    }
  } catch (error) {
    return h.view(NOT_FOUND_VIEW_PATH, {
      searchValue: qrCodeData,
      pageTitle: "Scan QR Code",
    });
  }
};

export const ScanHandlers = {
  getScan,
  postScan,
};
