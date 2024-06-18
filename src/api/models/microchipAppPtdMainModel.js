class MicrochipAppPtdMainModel {
  constructor(data) {
    this.documentState = data.documentState;
    this.ptdNumber = data.ptdNumber;
    this.issuedDate = data.issuedDate;
    this.microchipDate = data.microchipDate;    
    this.petName = data.petName;
    this.petSpecie = data.petSpecie;
    this.petBreed = data.petBreed;
    this.petSex = data.petSex;
    this.petDoB = data.petDoB;
    this.petColour = data.petColour;
    this.petFeaturesDetail = data.petFeaturesDetail;
    
    this.petId = data.petId;
    this.applicationId = data.applicationId;
    this.travelDocumentId = data.travelDocumentId;
    this.error = data.error;
  }
}

export { MicrochipAppPtdMainModel }
