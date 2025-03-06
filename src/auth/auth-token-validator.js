import decodeJwt from "./token-verify/jwt-decode.js";
import { UnauthorizedError, ForbiddenError } from "../exceptions/index.js";

console.log(
  "UnauthorizedError prototype:",
  Object.getPrototypeOf(UnauthorizedError)
);
console.log("ForbiddenError prototype:", Object.getPrototypeOf(ForbiddenError));


const validateToken = (token) => {
  console.log("Starting token validation...");
  if (!token) {
    console.log("No token provided");
    throw new UnauthorizedError("No token provided");
  }

  try {
    console.log("Decoding token...");
    const decodedToken = decodeJwt(token);
    console.log("Token decoded successfully. Checking roles...");
    console.log("Roles:", JSON.stringify(decodedToken.roles));

    if (
      !decodedToken.roles ||
      !Array.isArray(decodedToken.roles) ||
      decodedToken.roles.length === 0
    ) {
      console.log("No roles found in token");
      throw new UnauthorizedError("User has no roles in token");
    }

    console.log("Checking for Checker role...");
    const hasCheckerRole = decodedToken.roles.some(
      (role) => role.includes(":Checker:") || role === "Checker"
    );
    console.log("Has Checker role:", hasCheckerRole);

    if (!hasCheckerRole) {
      console.log("User does not have Checker role");
      throw new UnauthorizedError("User does not have Checker role");
    }

    console.log("Extracting organization ID...");
    console.log("Relationships:", JSON.stringify(decodedToken.relationships));
    let organisationId = null;
    if (
      decodedToken.relationships &&
      Array.isArray(decodedToken.relationships) &&
      decodedToken.relationships.length > 0
    ) {
      const relationship = decodedToken.relationships[0];
      console.log("First relationship:", relationship);
      const parts = relationship.split(":");
      console.log("Parts:", parts);
      if (parts.length > 0) {
        organisationId = parts[1];
      }
    }
    console.log("Organization ID:", organisationId);

    if (!organisationId) {
      console.log("No organization ID found");
      throw new ForbiddenError("No organization ID found in token");
    }

    console.log("Token validation successful");
    return {
      userId: decodedToken.sub,
      firstName: decodedToken.firstName,
      lastName: decodedToken.lastName,
      organisationId,
      email: decodedToken.email,
      roles: decodedToken.roles,
    };
  } catch (error) {
    console.error("Error during token validation:", error);
    console.error("Error stack:", error.stack);

   if (error instanceof UnauthorizedError) {
     console.log("Error is UnauthorizedError instance");
     console.log("Error prototype:", Object.getPrototypeOf(error));
     console.log(
       "UnauthorizedError prototype:",
       Object.getPrototypeOf(UnauthorizedError.prototype)
     );
     throw error;
   } else if (error instanceof ForbiddenError) {
     console.log("Throwing ForbiddenError");
     throw error;
   } else {
     console.log("Throwing generic UnauthorizedError");
     throw new UnauthorizedError("Token validation failed: " + error.message);
   }
  }
};

export default validateToken;
