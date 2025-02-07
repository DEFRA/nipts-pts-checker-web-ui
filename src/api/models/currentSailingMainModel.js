class CurrentSailingMainModel {
    constructor(data) {
      this.pageHeading = data.pageHeading;
      this.pageTitle = data.pageTitle;
      this.routeSubHeading = data.routeSubHeading;
      this.sailingRoutes = data.routes;
      this.sailingTimeSubHeading = data.sailingTimeSubHeading;
      this.sailingHintText1 = data.sailingHintText1;
      this.sailingTimes = data.sailingTimes;
      this.currentSailingMainModelErrors = data.currentSailingMainModelErrors;  
      this.routeOptions = data.routeOptions;
      this.routeOptionHeading = data.routeOptionHeading;
      this.flightSubHeading = data.flightSubHeading;
      this.scheduledDepartureHeading = data.scheduledDepartureHeading;
      this.scheduledDepartureHelpText = data.scheduledDepartureHelpText;
      this.dayText = data.dayText;
      this.monthText = data.monthText;
      this.yearText = data.yearText;
    }
  }
  
  export { CurrentSailingMainModel };