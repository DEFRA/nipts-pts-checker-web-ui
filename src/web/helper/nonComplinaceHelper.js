    import { CurrentSailingRouteOptions } from "../../constants/currentSailingConstant.js";
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

    export { getJourneyDetails }