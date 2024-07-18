import currentSailingMainService from "../../../../api/services/currentSailingMainService.js";
import {
  validateRouteRadio,
  validateSailingHour,
  validateSailingMinutes,
} from "./validate.js";

const VIEW_PATH = "componentViews/checker/currentsailing/currentsailingView";

const getCurrentSailings = async (request, h) => {
  const currentSailingMainModelData =
    (await currentSailingMainService.getCurrentSailingMain(request)) || {};
  request.yar.set("CurrentSailingModel", currentSailingMainModelData);
  request.yar.set("SailingRoutes", currentSailingMainModelData.sailingRoutes);
  return h.view(VIEW_PATH, { currentSailingMainModelData });
};

const submitCurrentSailingSlot = async (request, h) => {
  let { routeRadio, sailingHour, sailingMinutes } = request.payload;
  const validationRouteRadioResult = validateRouteRadio(routeRadio);
  const validateSailingHourResult = validateSailingHour(sailingHour);
  const validateSailingMinutesResult = validateSailingMinutes(sailingMinutes);
  const currentSailingMainModelData =  request.yar.get("CurrentSailingModel");

  if (!validationRouteRadioResult.isValid ||
    !validateSailingHourResult.isValid ||
    !validateSailingMinutesResult.isValid) {

      let errorSummary = [];
      if(!validationRouteRadioResult.isValid)
      {
        errorSummary.push({ fieldId: "routeRadio", message: validationRouteRadioResult.error });
      }

      if(!validateSailingHourResult.isValid ||
        !validateSailingMinutesResult.isValid)
      {
        let errorSummaryMessage;
        if(!validateSailingHourResult.isValid)
        {
          errorSummaryMessage = validateSailingHourResult.error;
        }
        else{
          errorSummaryMessage = validateSailingMinutesResult.error;
        }
        errorSummary.push({ fieldId: "sailingHour", message: errorSummaryMessage });
      }

      return h.view(VIEW_PATH, {
        errorRouteRadio: validationRouteRadioResult.error,
        errorSailingHour: validateSailingHourResult.error,
        errorSailingMinutes: validateSailingMinutesResult.error,
        errorSummary,
        formSubmitted: true,
        currentSailingMainModelData,
        routeRadio,
        sailingHour,
        sailingMinutes,
      });
  }

  // Handle the form submission here
  const sailingRoutes = request.yar.get("SailingRoutes");
  const selectedRoute = sailingRoutes.find(
    (x) => x.id === request.payload.routeRadio
  );

  const currentSailingSlot = {
    sailingHour: request.payload.sailingHour,
    sailingMinutes: request.payload.sailingMinutes,
    selectedRoute,
  };

  request.yar.set("CurrentSailingSlot", currentSailingSlot);

  // Perform necessary validations and actions here

  // If successful, redirect to the dashboard
  return h.redirect("/checker/dashboard");
};

const getCurrentSailingSlot = async (request, h) => {
  const currentSailingSlot = request.yar.get("CurrentSailingSlot");
  return h.response({
    message: "Retrieved Current sailing slot",
    currentSailingSlot,
  });
};

export const CurrentSailingHandlers = {
  getCurrentSailings,
  submitCurrentSailingSlot,
  getCurrentSailingSlot,
};
