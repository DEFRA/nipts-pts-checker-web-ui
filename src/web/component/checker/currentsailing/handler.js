import currentSailingMainService from "../../../../api/services/currentSailingMainService.js";

const VIEW_PATH = "componentViews/checker/currentsailing/currentsailingView";

const getCurrentSailings = async (request, h) => {
  const currentSailingMainModelData =
    (await currentSailingMainService.getCurrentSailingMain(request)) || {};
  request.yar.set("SailingRoutes", currentSailingMainModelData.sailingRoutes);
  return h.view(VIEW_PATH, { currentSailingMainModelData });
};

const submitCurrentSailingSlot = async (request, h) => {
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
