import { AppSettingsModel } from "../models/appSettingsModel.js";

const data = {
  ptsTitle: "Pet Travel Scheme",
  ptsSubTitle: "Check a pet from Great Britain to Northern Ireland",
};

const getAppSettings = () => new AppSettingsModel(...Object.values(data));

export default {
  getAppSettings,
};
