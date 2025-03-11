import decodeJwt from "./token-verify/jwt-decode.js";
import { ForbiddenError } from "../exceptions/index.js";

const validateTokenExists = (token) => {
  if (!token) {
    throw new ForbiddenError("No token provided");
  }
  return true;
};

const validateUserRoles = (decodedToken) => {
  if (
    !decodedToken.roles ||
    !Array.isArray(decodedToken.roles) ||
    decodedToken.roles.length === 0
  ) {
    throw new ForbiddenError("User has no roles in token");
  }
  return true;
};

const validateCheckerRole = (decodedToken) => {
  const hasCheckerRole = decodedToken.roles.some(
    (role) => role.includes(":Checker:") || role === "Checker"
  );

  if (!hasCheckerRole) {
    throw new ForbiddenError("User does not have Checker role");
  }
  return true;
};

const extractOrganisationId = (decodedToken) => {
  let organisationId = null;
  if (
    decodedToken.relationships &&
    Array.isArray(decodedToken.relationships) &&
    decodedToken.relationships.length > 0
  ) {
    const relationship = decodedToken.relationships[0];
    const parts = relationship.split(":");
    if (parts.length > 0) {
      organisationId = parts[1];
    }
  }

  if (!organisationId) {
    throw new ForbiddenError("No organization ID found in token");
  }
  return organisationId;
};

const createUserObject = (decodedToken, organisationId) => {
  return {
    userId: decodedToken.sub,
    firstName: decodedToken.firstName,
    lastName: decodedToken.lastName,
    organisationId,
    email: decodedToken.email,
    roles: decodedToken.roles,
  };
};

const handleTokenValidationError = (error) => {
  if (error instanceof ForbiddenError) {
    throw error;
  } else {
    throw new ForbiddenError("Token validation failed: " + error.message);
  }
};

const validateToken = (token) => {
  try {
    validateTokenExists(token);
    const decodedToken = decodeJwt(token);
    validateUserRoles(decodedToken);
    validateCheckerRole(decodedToken);
    const organisationId = extractOrganisationId(decodedToken);
    return createUserObject(decodedToken, organisationId);
  } catch (error) {
    return handleTokenValidationError(error);
  }
};

export default validateToken;
