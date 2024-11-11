class OrganisationMainModel {
  constructor(data) {
    this.Id = data.Id;
    this.Name = data.Name;
    this.Location = data.Location;
    this.ExternalId = data.ExternalId;
    this.ActiveFrom = data.ActiveFrom;
    this.ActiveTo = data.ActiveTo;
    this.IsActive = data.IsActive;
  }
}

export { OrganisationMainModel };