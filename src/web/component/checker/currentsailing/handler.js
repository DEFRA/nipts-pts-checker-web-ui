"use strict";
import moment from "moment-timezone";
import currentSailingMainService from "../../../../api/services/currentSailingMainService.js";
import {
  validateRouteOptionRadio,
  validateRouteRadio,
  validateSailingHour,
  validateSailingMinutes,
  validateFlightNumber,
  validateDate,
} from "./validate.js";
import headerData from "../../../../web/helper/constants.js";
const VIEW_PATH = "componentViews/checker/currentsailing/currentsailingView";

const getCurrentSailings = async (request, h) => {
  headerData.section = "sailing";
  const currentSailingMainModelData =
    (await currentSailingMainService.getCurrentSailingMain(request)) || {};
  request.yar.set("CurrentSailingModel", currentSailingMainModelData);
  request.yar.set("SailingRoutes", currentSailingMainModelData.sailingRoutes);

 
  let londonTime = moment.tz("Europe/London");
  let departureDateDay = londonTime.format('DD');
  let departureDateMonth = londonTime.format('MM');
  let departureDateYear = londonTime.format('YYYY');

  //this is not caught in OnPreResponse. If we let it continue, we will get a template
  //render error, so handle it here
  if (currentSailingMainModelData.status === 500 || currentSailingMainModelData.status === 401) {
    throw Boom.badImplementation('error retreiving current saling data');
  }

  return h.view(VIEW_PATH, { 
    currentSailingMainModelData,
    departureDateDay,
    departureDateMonth,
    departureDateYear
  });
};

const submitCurrentSailingSlot = async (request, h) => {
  let { routeOption, routeRadio, routeFlight, departureDateDay, departureDateMonth, departureDateYear, sailingHour, sailingMinutes } = request.payload;
  const validationRouteOptionRadioResult = validateRouteOptionRadio(routeOption);
  let validationRouteRadioResult;
  let validateFlightNumberResult;
  const validateSailingHourResult = validateSailingHour(sailingHour);
  const validateSailingMinutesResult = validateSailingMinutes(sailingMinutes);
  const departureDate = departureDateDay.trim() + "/" + departureDateMonth.trim() + "/" + departureDateYear.trim();
  const validateDepartureDateResult = validateDate(departureDate);
  const currentSailingMainModelData =  request.yar.get("CurrentSailingModel");

  let errorSummary = [];
  let isValid = true;
  if(!validationRouteOptionRadioResult.isValid)
  {
    errorSummary.push({ fieldId: "routeOption", message: validationRouteOptionRadioResult.error });
    isValid = false;
  }
  
  if (validationRouteOptionRadioResult.isValid)
  {
    if(routeOption === currentSailingMainModelData.routeOptions[0].id)
    {
      validationRouteRadioResult = validateRouteRadio(routeRadio);
      if(!validationRouteRadioResult.isValid)
      {
        errorSummary.push({ fieldId: "routeRadio", message: validationRouteRadioResult.error });
        isValid = false;
      }
    }
    
    if(routeOption === currentSailingMainModelData.routeOptions[1].id)
    {
      validateFlightNumberResult = validateFlightNumber(routeFlight);
      if(!validateFlightNumberResult.isValid)
        {
          errorSummary.push({ fieldId: "routeFlight", message: validateFlightNumberResult.error });
          isValid = false;
        }
    }
  }


  if(!validateDepartureDateResult.isValid)
  {
    errorSummary.push({ fieldId: "departureDateDay", message: validateDepartureDateResult.error });
    isValid = false;
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
      isValid = false;
    }

    if(!isValid)
    {
      return h.view(VIEW_PATH, {
        errorRouteOptionRadio: validationRouteOptionRadioResult.error,
        errorRouteRadio: validationRouteRadioResult ? validationRouteRadioResult.error : null,
        errorFlight: validateFlightNumberResult ? validateFlightNumberResult.error : null,
        errorDepartureDate: validateDepartureDateResult.error,       
        errorSailingHour: validateSailingHourResult.error,
        errorSailingMinutes: validateSailingMinutesResult.error,
        errorSummary,
        formSubmitted: true,
        currentSailingMainModelData,
        routeRadio,
        sailingHour,
        sailingMinutes,
        routeOption,
        routeFlight,
        departureDateDay,
        departureDateMonth,
        departureDateYear,
      });
    }


  // Handle the form submission here
  const selectedRouteOption = currentSailingMainModelData.routeOptions.find(
    (x) => x.id === request.payload.routeOption
  );

  const sailingRoutes = request.yar.get("SailingRoutes");
  let selectedRoute =null;
  if(sailingRoutes !== null)
  {
    selectedRoute = sailingRoutes.find(
      (x) => x.id === request.payload.routeRadio
    );
  }

  const currentSailingSlot = {
    sailingHour: request.payload.sailingHour,
    sailingMinutes: request.payload.sailingMinutes,
    selectedRoute,
    departureDate,
    selectedRouteOption,
    routeFlight,
  };

  request.yar.set("CurrentSailingSlot", currentSailingSlot);

  // Perform necessary validations and actions here

  // If successful, redirect to the dashboard
  return h.redirect("/checker/dashboard");
};

const getCurrentSailingSlot = async (request, h) => {
  const currentSailingSlot = request.yar.get("CurrentSailingSlot");
  return h.response({
    message: "Retrieved Route details slot",
    currentSailingSlot,
  });
};

export const CurrentSailingHandlers = {
  getCurrentSailings,
  submitCurrentSailingSlot,
  getCurrentSailingSlot,
};
