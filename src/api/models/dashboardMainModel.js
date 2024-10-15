class DashboardMainModel {
  constructor(data) {
    this.routeName = data.routeName;
    this.operatorName = data.operatorName;
    this.departurePort = data.departurePort;
    this.arrivalPort = data.arrivalPort;
    this.departureDate = data.departureDate;
    this.departureTime = data.departureTime;
    this.passCount = data.passCount;
    this.failCount = data.failCount;
    this.failReason = data.failReason;
    this.viewDetailsLink = data.viewDetailsLink;
  }
}

export { DashboardMainModel };
