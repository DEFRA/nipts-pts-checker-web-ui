import { v4 as uuidv4 } from "uuid";
import session from "../../session/index.js";
import sessionKeys from "../../session/keys.js";
import config from "../../config/index.js";
import { ForbiddenError } from "../../exceptions/index.js";

const generate = (request) => {
  const state = {
    id: uuidv4(),
    namespace: config.namespace,
    source: "PTSCompliancePortal",
  };

  const base64EncodedState = Buffer.from(JSON.stringify(state)).toString(
    "base64"
  );
  session.setToken(request, sessionKeys.tokens.state, base64EncodedState);
  return base64EncodedState;
};

const verify = (request) => {
  if (!request.query.error) {
    const state = request.query.state;
    if (!state) {
      return false;
    }

    const decodedState = JSON.parse(
      Buffer.from(state, "base64").toString("ascii")
    );

    const sessionValue = session.getToken(request, sessionKeys.tokens.state);
    if (sessionValue == null) {
      throw new ForbiddenError("Cannot get token from request");
    }

    const savedState = JSON.parse(
      Buffer.from(sessionValue, "base64").toString("ascii")
    );

    return decodedState.id === savedState.id;
  } else {
    console.log(
      `Error returned from authentication request ${request.query.error_description} for id ${request.yar.id}.`
    );
    return false;
  }
};

export default { generate, verify };
