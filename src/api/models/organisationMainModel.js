function organisationMainModel(data) {
  return {
    Id: data.Id,
    Name: data.Name,
    Location: data.Location,
    ExternalId: data.ExternalId,
    ActiveFrom: data.ActiveFrom,
    ActiveTo: data.ActiveTo,
    IsActive: data.IsActive
  };
}

export { organisationMainModel };