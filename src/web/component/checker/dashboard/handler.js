"use strict";

const VIEW_PATH = "componentViews/checker/dashboard/dashboardView";

const getDashboard = {
  index: {
    plugins: {
      "hapi-auth-cookie": {
        redirectTo: false,
      },
    },
    handler: async (request, h) => {
      const currentSailingSlot = request.yar.get('CurrentSailingSlot');   
      currentSailingSlot.currentDate = new Date().toLocaleDateString();
      return h.view(VIEW_PATH, { currentSailingSlot });
    },
  },
};

export const DashboardHandlers = {
  getDashboard,
};
