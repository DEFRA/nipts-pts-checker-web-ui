
export function getPtdNumberByDocState(documentState, item) {
  return (documentState === "approved" || documentState === "revoked")
  ? item?.travelDocument?.travelDocumentReferenceNumber
  : item?.application?.referenceNumber;
}

export function getIssueDateByDocState(documentState, item) {
  switch (documentState) {
    case "approved":
      return item?.application?.dateAuthorised;
    case "revoked":
      return item?.application?.dateRevoked;
    case "rejected":
      return item?.application?.dateRejected;
    default:
      return item?.application?.dateOfApplication;
  }
}