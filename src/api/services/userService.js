import session from "../../session/index.js";
import sessionKeys from "../../session/keys.js";
import decodeJwt from "../../auth/token-verify/jwt-decode.js";

const getToken = (request) => {
  const token = session.getToken(request, sessionKeys.tokens.accessToken);
  return token;
};

const userHasOrganisation = (request) => {
  const organisation = getUserOrganisation(request);
  return organisation?.organisationId?.length > 0;
};


const getUserOrganisation = (request) => {
  const organisation = {
    relationshipId: "",
    organisationId: "",
    organisationName: "",
  };

  const accessToken = getToken(request);
  if (!accessToken) {
    return organisation;
  }

  const token = decodeJwt(accessToken);
  organisation.relationshipId = token.currentRelationshipId;

  if (token.relationships && token.relationships.length > 0) {
    token.relationships.forEach((relationship) => {
      const relationArray = relationship.split(":");
      if (relationArray.length > 0 && token.currentRelationshipId === relationArray[0]) {
        // Update organisation details
        organisation.organisationId = relationArray[1] || "";
        organisation.organisationName = relationArray[2] || "";
      }
    });
  }

  return organisation;
};



export default {
  getToken,
  userHasOrganisation,
  getUserOrganisation,
};
