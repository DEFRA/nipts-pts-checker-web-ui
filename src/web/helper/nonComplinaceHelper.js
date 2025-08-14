    import { CurrentSailingRouteOptions } from "../../constants/currentSailingConstant.js";
    import { CheckOutcomeConstants } from "../../constants/checkOutcomeConstant.js";
    
    function formatPTDNumber(PTDNumber) {
        const PTD_LENGTH = 11;
        const PTD_PREFIX_LENGTH = 5;
        const PTD_MID_LENGTH = 8;

        return `${PTDNumber.padStart(PTD_LENGTH, "0").slice(0, PTD_PREFIX_LENGTH)} ` +
            `${PTDNumber.padStart(PTD_LENGTH, "0").slice(PTD_PREFIX_LENGTH, PTD_MID_LENGTH)} ` +
            `${PTDNumber.padStart(PTD_LENGTH, "0").slice(PTD_MID_LENGTH)}`;
    }

    function toBooleanOrNull(value, defaultValue) {
      return value === "true" ? true : defaultValue;
    }

    function getPayloadValue(payload, key) {
      const value = payload?.[key];
      return value === '' ? null : value ?? null;
    }

    function getDefaultCurrentSailing(request) {
      return request.yar.get("currentSailingSlot") || {};
    }
    
    const getJourneyDetails = (request, isGBCheck)  => {
      //Pass Journey Details from Session Stored in Header "currentSailingSlot"
      const currentSailingSlot = getDefaultCurrentSailing(request);
      let currentDate = currentSailingSlot.departureDate
        .split("/")
        .reverse()
        .join("-");
      
      let sailingHour = currentSailingSlot.sailingHour;
      let sailingMinutes = currentSailingSlot.sailingMinutes;
      let dateTimeString = `${currentDate}T${sailingHour}:${sailingMinutes}:00Z`;
    
      let routeId = currentSailingSlot?.selectedRoute?.id ?? null;
      const routeOptionId = currentSailingSlot.selectedRouteOption.id;
      const flightNumber = currentSailingSlot?.routeFlight ?? null;    
      if(routeOptionId === CurrentSailingRouteOptions[1].id)
      {
        request.yar.clear("checkSummaryId");
      }
  
      //When Approval is of Type NI and RouteOption selected is of Type Ferry
      //If Journey details are available by cliciking view link and selecting the GB referral on UI(this sets in session)
      //If available from view link and GB referral on UI session pass session values, 
      //else use the default currentsailings session[this covers search or scan route]
      if(!isGBCheck && routeOptionId === CurrentSailingRouteOptions[0].id)
      {
         const referredRouteId = request.yar.get("routeId");
         const referredCheckCurrentDate = request.yar.get("departureDate");
         const referreDepartureTime = request.yar.get("departureTime");
         const referredCheckSummaryId = request.yar.get("checkSummaryId");
  
         if(referredRouteId && referredCheckCurrentDate && referreDepartureTime && referredCheckSummaryId)
         {  
            routeId = referredRouteId;       
            currentDate = referredCheckCurrentDate
                .split("/")
                .reverse()
                .join("-");
            
            sailingHour = referreDepartureTime.split(":")[0];
            sailingMinutes = referreDepartureTime.split(":")[1];
         }
  
         dateTimeString = `${currentDate}T${sailingHour}:${sailingMinutes}:00Z`;
      }
  
      return { dateTimeString, routeId, routeOptionId, flightNumber };
    };


    const createCheckOutcome = (request, context) => {
          const {
                data,
                payload,
                isGBCheck,
                dateTimeString,
                routeId,
                routeOptionId,
                flightNumber
            } = context;

          const checkerId = request.yar.get("checkerId");
          const gbcheckSummaryId = request.yar.get("checkSummaryId");
      
          return {
            applicationId: data.applicationId,
            checkOutcome: CheckOutcomeConstants.Fail,
            checkerId: checkerId ?? null,
            routeId: routeId,
            sailingTime: dateTimeString,
            sailingOption: routeOptionId,
            flightNumber: flightNumber,
            isGBCheck: isGBCheck,
            mcNotMatch: toBooleanOrNull(payload?.mcNotMatch, null),
            mcNotMatchActual: getPayloadValue(payload, "mcNotMatchActual"),
            mcNotFound: toBooleanOrNull(payload?.mcNotFound, null),
            vcNotMatchPTD: toBooleanOrNull(payload?.vcNotMatchPTD),
            oiFailPotentialCommercial: toBooleanOrNull(payload?.oiFailPotentialCommercial, null),
            oiFailAuthTravellerNoConfirmation: toBooleanOrNull(payload?.oiFailAuthTravellerNoConfirmation, null),
            oiFailOther: toBooleanOrNull(payload?.oiFailOther, null),
            passengerTypeId: getPayloadValue(payload, "passengerType"),
            relevantComments: getPayloadValue(payload, "relevantComments"),
            gbRefersToDAERAOrSPS: toBooleanOrNull(payload?.gbRefersToDAERAOrSPS, null),
            gbAdviseNoTravel: toBooleanOrNull(payload?.gbAdviseNoTravel, null),
            gbPassengerSaysNoTravel: toBooleanOrNull(payload?.gbPassengerSaysNoTravel, null),
            spsOutcome: toBooleanOrNull(payload?.spsOutcome, isGBCheck? null: false),
            spsOutcomeDetails: getPayloadValue(payload, "spsOutcomeDetails"),
            gBCheckId: gbcheckSummaryId ?? null,
        };
    };

    const updateNonComplianceYarSessions = (request) => {
         request.yar.clear("IsFailSelected");
    
        // Clear individual keys
        request.yar.clear("routeId");
        request.yar.clear("routeName");
        request.yar.clear("departureDate");
        request.yar.clear("departureTime");
        request.yar.clear("checkSummaryId");

        // Redirect to the dashboard
        request.yar.set("successConfirmation", true);
    };

    export { getJourneyDetails, createCheckOutcome, updateNonComplianceYarSessions, formatPTDNumber }