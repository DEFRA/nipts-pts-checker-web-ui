"use strict";
import headerData from "../../../../web/helper/constants.js";
import apiService from "../../../../api/services/apiService.js";
import DashboardMainModel from "../../../../constants/dashBoardConstant.js";

const VIEW_PATH = "componentViews/checker/scan/scanView";
const SEARCH_RESULT_VIEW_PATH = "/checker/scan-results";
const NOT_FOUND_VIEW_PATH = "componentViews/checker/scan/scanNotFoundView";
const ALLOW_CAMERA_PERMISSIONS = "componentViews/checker/scan/allowCameraPermissions";

const getScan = async (_request, h) => {
  headerData.section = "scan";
  return h.view(VIEW_PATH);
};

const getScanNotFound = async (_request, h) => {
  headerData.section = "scan";
  return h.view(NOT_FOUND_VIEW_PATH, {
    pageTitle: DashboardMainModel.dashboardMainModelData.pageTitle,
  });
};

const getAllowCameraPermissions = async (_request, h) => {
  return h.view(ALLOW_CAMERA_PERMISSIONS,{
    pageTitle: DashboardMainModel.dashboardMainModelData.pageTitle,
  });
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
        return h.redirect(
          `/checker/scan/not-found?searchValue=${encodeURIComponent(ptdNumber)}`
        );
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
        return h.redirect(
          `/checker/scan/not-found?searchValue=${encodeURIComponent(
            applicationNumber
          )}`
        );
      }

      request.yar.set("applicationNumber", applicationNumber);
      request.yar.set("data", responseData);
      return h.redirect(SEARCH_RESULT_VIEW_PATH);
    } else {
      return h.redirect(
        `/checker/scan/not-found?searchValue=${encodeURIComponent(qrCodeData)}`
      );
    }
  } catch (error) {
    global.appInsightsClient.trackException({ exception: error });
    return h.redirect(
      `/checker/scan/not-found?searchValue=${encodeURIComponent(qrCodeData)}`
    );
  }
};

export const ScanHandlers = {
  getScan,
  getScanNotFound,
  postScan,
  getAllowCameraPermissions,
};
