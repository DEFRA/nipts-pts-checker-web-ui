"use strict";
import DashboardMainModel from "../../../../constants/dashBoardConstant.js";
import apiService from "../../../../api/services/apiService.js";
import errorMessages from "./errorMessage.js";
import { HttpStatusConstants } from "../../../../constants/httpMethod.js"
import { CheckOutcomeConstants } from "../../../../constants/checkOutcomeConstant.js"

const VIEW_PATH = "componentViews/checker/searchresults/searchResultsView";

const getSearchResultsHandler = 
  async (request, h) => {
    const microchipNumber = request.yar.get("microchipNumber");
    const data = request.yar.get("data");
    const pageTitle = DashboardMainModel.dashboardMainModelData.pageTitle;
    return h.view(VIEW_PATH, { microchipNumber, data, pageTitle });
  };

const saveAndContinueHandler = async (request, h) => {
  try {

    let { checklist } = request.payload;
    if(checklist === 'pass')
    {
      checklist = CheckOutcomeConstants.Pass
    }
    else{
      checklist = CheckOutcomeConstants.Fail
    }
    
    const data = request.yar.get("data");
    if(data.documentState == 'rejected' || data.documentState == 'revoked')
    {
      checklist = CheckOutcomeConstants.Fail;
    }

    const currentSailingSlot = request.yar.get("CurrentSailingSlot") || {};

    let currentDate = new Date().toLocaleDateString("en-GB").split('/').reverse().join('-');
    let dateTimeString = currentDate + 'T' + currentSailingSlot.sailingHour + ':' + currentSailingSlot.sailingMinutes + ':00Z';

    const checkOutcome = {
      applicationId: data.applicationId,
      checkOutcome: checklist,
      checkerId: null,
      routeId: currentSailingSlot.selectedRoute.id,
      sailingTime: dateTimeString
    };

    const responseData = await apiService.recordCheckOutCome(checkOutcome);
    if (responseData.error) 
    {
      const microchipNumber = request.yar.get("microchipNumber");
      const data = request.yar.get("data");
      const pageTitle = DashboardMainModel.dashboardMainModelData.pageTitle;

      let errorMessage = errorMessages.serviceError.message;
      let errorSummary = [
        { fieldId: "unexpected", message: errorMessages.serviceError.message },
      ]; 
      
      return h.response({
        status: "fail",
        message: errorMessage,
        details: errorSummary,
      }).code(HttpStatusConstants.BAD_REQUEST).takeover();
    }


    if (checklist === CheckOutcomeConstants.Pass) {
      return h.response({
        status: 'success',
        message: 'Check pass',
        redirectTo: '/checker/document-search',
      }).code(200);
    }

    return h.response({
      status: 'success',
      message: 'Check fail',
      redirectTo: '/checker/non-compliance',
    }).code(200);

  } catch (error) {
    return h.view(VIEW_PATH, {
      error: "An error occurred while processing your request",
      errorSummary: [
        { fieldId: "general", message: "An unexpected error occurred" },
      ],
    });
  }
};

export const SearchResultsHandlers = {
  getSearchResultsHandler,
  saveAndContinueHandler,
};
