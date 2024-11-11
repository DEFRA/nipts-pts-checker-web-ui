class SpsReferralMainModel {
  constructor(data) {
    this.PTDNumber = data.PTDNumber;
    this.PetDescription = data.PetDescription;
    this.Microchip = data.Microchip;
    this.TravelBy = data.TravelBy;
    this.SPSOutcome = data.SPSOutcome;
    this.classColour = data.classColour;
    this.CheckSummaryId = data.CheckSummaryId
  }
}

export { SpsReferralMainModel };
