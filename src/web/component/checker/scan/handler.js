"use strict";
import headerData from "../../../../web/helper/constants.js";

const VIEW_PATH = "componentViews/checker/scan/scanView";

const getScan = async (request, h) => {
  headerData.section = "scan"
  return h.view(VIEW_PATH);
};

const postScan = async (request, h) => {
  const { qrCodeData } = request.payload;
  console.log("QR code data received:", qrCodeData);
  return h.redirect("/checker/dashboard"); 
};

export const ScanHandlers = {
  getScan,
  postScan,
};
