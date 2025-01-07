"use strict";

const VIEW_PATH = "componentViews/checker/scan/scanView";

const getScan = async (request, h) => {
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
